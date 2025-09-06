// src/controllers/video.controller.js
import path from "path";
import fs from "fs";
import https from "https";
import crypto from "crypto";
import { spawn } from "child_process";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Video } from "../models/video.model.js";
import { FeatureHistory } from "../models/featureHistory.model.js";
import { uploadOnCloudinary, destroyOnCloudinary } from "../utils/cloudinary.js";

/* ------------------------------- config -------------------------------- */

const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
const PY_SCRIPTS_DIR = process.env.PY_SCRIPTS_DIR || "./python";
const YOLO_WEIGHTS = process.env.YOLO_WEIGHTS || "./python/assets/yolov4.weights";
const YOLO_CFG = process.env.YOLO_CFG || "./python/assets/yolov4.cfg";
const YOLO_NAMES = process.env.YOLO_NAMES || "./python/assets/coco.names";
const TEMP_DIR = path.resolve("./public/temp");

function ensureTempDir() {
  try {
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch {}
}
ensureTempDir();

/* -------------------------------- utils -------------------------------- */

const safeUnlink = (p) => {
  try { if (p && fs.existsSync(p)) fs.unlinkSync(p); } catch {}
};

function sha256File(localPath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(localPath));
  return hash.digest("hex");
}

function downloadToTemp(url, ext = ".mp4") {
  return new Promise((resolve, reject) => {
    const out = path.join(TEMP_DIR, `vid-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
    const file = fs.createWriteStream(out);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          file.close(() => safeUnlink(out));
          return reject(new Error(`Download failed: ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(out)));
      })
      .on("error", (err) => {
        file.close(() => safeUnlink(out));
        reject(err);
      });
  });
}

function runPython(scriptName, args = []) {
  const scriptPath = path.resolve(PY_SCRIPTS_DIR, scriptName);
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_BIN, [scriptPath, ...args], { env: process.env });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error(`Python ${scriptName} exited ${code}: ${stderr || stdout}`));
      resolve({ stdout, stderr });
    });
  });
}

function parseTaggedJson(stdout, tag) {
  const i = stdout.lastIndexOf(tag);
  if (i === -1) return null;
  const s = stdout.slice(i + tag.length).trim();
  try { return JSON.parse(s); } catch { return null; }
}

/* ----------------------------- controllers ----------------------------- */

/**
 * POST /api/v1/videos/upload
 * field: "video"
 * - dedupe by checksum per user
 * - upload to Cloudinary
 * - create Video doc
 */
export const uploadVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const localPath = req.file?.path;
  if (!localPath) throw new ApiError(400, "Video file is required");

  const checksum = sha256File(localPath);

  const existed = await Video.findOne({ owner: userId, checksum });
  if (existed) {
    safeUnlink(localPath);
    return res.status(200).json(new ApiResponse(200, { video: existed, alreadyAdded: true }, "Video already exists"));
  }

  const up = await uploadOnCloudinary(localPath, "video");
  if (!up?.url || !up?.public_id) throw new ApiError(500, "Failed to upload video");

  const video = await Video.create({
    owner: userId,
    originalUrl: up.secure_url || up.url,
    originalPublicId: up.public_id,
    provider: "cloudinary",
    checksum,
    filename: req.file?.originalname || undefined,
    mimetype: req.file?.mimetype || undefined,
  });

  return res.status(201).json(new ApiResponse(201, { video, alreadyAdded: false }, "Video uploaded"));
});

/**
 * POST /api/v1/videos/:videoId/unique-counts
 * Body: { classes?: string[], sampleRate?, conf?, nms? }
 * - returns cached counts if present
 * - else runs python and caches in Video + writes FeatureHistory
 */
export const computeUniqueCounts = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findOne({ _id: videoId, owner: userId });
  if (!video) throw new ApiError(404, "Video not found");

  if (video.uniqueCounts?.length) {
    return res.status(200).json(new ApiResponse(200, { uniqueCounts: video.uniqueCounts, cached: true }, "OK"));
  }

  const localIn = await downloadToTemp(video.originalUrl, ".mp4");
  try {
    const args = [
      "--input", localIn,
      "--weights", YOLO_WEIGHTS,
      "--config", YOLO_CFG,
      "--names", YOLO_NAMES,
    ];
    const { classes, sampleRate, conf, nms } = req.body || {};
    if (Array.isArray(classes) && classes.length) args.push("--classes", ...classes);
    if (sampleRate) args.push("--sample_rate", String(sampleRate));
    if (conf) args.push("--conf", String(conf));
    if (nms) args.push("--nms", String(nms));

    const { stdout } = await runPython("unique_counter.py", args);
    const countsMap = parseTaggedJson(stdout, "JSON_UNIQUE_COUNTS::");
    if (!countsMap) throw new ApiError(500, "Unable to parse unique counts");

    const uniqueCounts = Object.entries(countsMap).map(([className, count]) => ({ className, count }));

    video.uniqueCounts = uniqueCounts;
    video.uniqueCountsModelVersion = "yolov4";
    video.uniqueCountsComputedAt = new Date();
    await video.save();

    await FeatureHistory.create({
      user: userId,
      video: video._id,
      type: "UNIQUE_COUNT",
      params: {},
      result: { uniqueCounts },
    });

    return res.status(200).json(new ApiResponse(200, { uniqueCounts, cached: false }, "Computed"));
  } finally {
    safeUnlink(localIn);
  }
});

/**
 * POST /api/v1/videos/:videoId/bbox
 * Body: { classes?: string[], conf?, nms? }
 * - returns cached bboxVideoUrl if present
 * - else runs python to generate, uploads to Cloudinary, caches URL + history
 */
export const generateBboxVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findOne({ _id: videoId, owner: userId });
  if (!video) throw new ApiError(404, "Video not found");

  if (video.bboxVideoUrl) {
    return res.status(200).json(new ApiResponse(200, { bboxVideoUrl: video.bboxVideoUrl, cached: true }, "OK"));
  }

  const localIn = await downloadToTemp(video.originalUrl, ".mp4");
  const localOut = path.join(TEMP_DIR, `bbox-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.mp4`);

  try {
    const args = [
      "--input", localIn,
      "--output", localOut,
      "--weights", YOLO_WEIGHTS,
      "--config", YOLO_CFG,
      "--names", YOLO_NAMES,
    ];
    const { classes, conf, nms } = req.body || {};
    if (Array.isArray(classes) && classes.length) args.push("--classes", ...classes);
    if (conf) args.push("--conf", String(conf));
    if (nms) args.push("--nms", String(nms));

    await runPython("bbox_generator.py", args);

    const up = await uploadOnCloudinary(localOut, "video");
    if (!up?.url || !up?.public_id) throw new ApiError(500, "Failed to upload bbox video");

    video.bboxVideoUrl = up.secure_url || up.url;
    video.bboxVideoPublicId = up.public_id;
    video.bboxModelVersion = "yolov4";
    video.bboxGeneratedAt = new Date();
    await video.save();

    await FeatureHistory.create({
      user: userId,
      video: video._id,
      type: "BBOX",
      params: {},
      result: { bboxVideoUrl: video.bboxVideoUrl },
    });

    return res.status(200).json(new ApiResponse(200, { bboxVideoUrl: video.bboxVideoUrl, cached: false }, "Generated"));
  } finally {
    safeUnlink(localIn);
    safeUnlink(localOut);
  }
});

/**
 * POST /api/v1/videos/:videoId/graph
 * Body: { limit: number, classes?: string[], sampleRate?, conf?, nms? }
 * - does NOT store heavy results in DB
 * - runs python to generate chart image, uploads image to Cloudinary, returns URL
 * - stores only params in FeatureHistory
 */
export const runGraph = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  const { limit, classes, sampleRate, conf, nms } = req.body || {};

  if (!limit || Number(limit) <= 0) throw new ApiError(400, "limit is required and must be > 0");

  const video = await Video.findOne({ _id: videoId, owner: userId });
  if (!video) throw new ApiError(404, "Video not found");

  const localIn = await downloadToTemp(video.originalUrl, ".mp4");
  const chartPath = path.join(TEMP_DIR, `chart-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.png`);

  try {
    const args = [
      "--input", localIn,
      "--output", chartPath,
      "--weights", YOLO_WEIGHTS,
      "--config", YOLO_CFG,
      "--names", YOLO_NAMES,
      "--limit", String(limit),
    ];
    if (Array.isArray(classes) && classes.length) args.push("--classes", ...classes);
    if (sampleRate) args.push("--sample_rate", String(sampleRate));
    if (conf) args.push("--conf", String(conf));
    if (nms) args.push("--nms", String(nms));

    const { stdout } = await runPython("graph_analyzer.py", args);
    const parsed = parseTaggedJson(stdout, "JSON_GRAPH_OUTPUT::"); // optional if your script prints JSON

    let chartUrl = null;
    if (fs.existsSync(chartPath)) {
      const up = await uploadOnCloudinary(chartPath, "image");
      chartUrl = up?.secure_url || up?.url || null;
    }

    await FeatureHistory.create({
      user: userId,
      video: video._id,
      type: "GRAPH",
      params: {
        limit: Number(limit),
        classes: Array.isArray(classes) ? classes : [],
      },
      result: {},
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { chartUrl, series: parsed?.series || {}, frames: parsed?.frames || [] }, "Graph ready"));
  } finally {
    safeUnlink(localIn);
    safeUnlink(chartPath);
  }
});

/**
 * GET /api/v1/videos/:videoId/history
 */
export const getVideoHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findOne({ _id: videoId, owner: userId }).select("_id");
  if (!video) throw new ApiError(404, "Video not found");

  const history = await FeatureHistory.find({ user: userId, video: videoId })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, { history }, "OK"));
});

/**
 * DELETE /api/v1/videos/:videoId
 * - delete Cloudinary assets (best effort), feature history, and video doc
 */
export const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findOne({ _id: videoId, owner: userId });
  if (!video) throw new ApiError(404, "Video not found");

  const ops = [];
  if (video.originalPublicId) ops.push(destroyOnCloudinary(video.originalPublicId, "video"));
  if (video.bboxVideoPublicId) ops.push(destroyOnCloudinary(video.bboxVideoPublicId, "video"));
  const cloudinaryResults = await Promise.allSettled(ops);

  await FeatureHistory.deleteMany({ user: userId, video: video._id });
  await Video.deleteOne({ _id: video._id });

  return res.status(200).json(new ApiResponse(200, { cloudinaryResults }, "Video and history deleted"));
});
