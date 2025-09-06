// src/controllers/featureHistory.controller.js
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { fileChecksum } from "../utils/checksum.js";

import { Video } from "../models/video.model.js";
import { FeatureHistory } from "../models/featureHistory.model.js";

/** ---------- helpers ---------- **/

// parse python stdout with a required marker safely
function parsePythonJson(stdout, marker) {
  const idx = stdout.indexOf(marker);
  if (idx === -1) return { ok: false, error: "Missing marker", raw: stdout };
  try {
    const json = JSON.parse(stdout.slice(idx + marker.length));
    return { ok: true, json };
  } catch (e) {
    return { ok: false, error: "Invalid JSON from python", raw: stdout };
  }
}

// ensure a Video doc for this user+file (dedupe by checksum). Uploads to Cloudinary if not exists.
async function ensureVideoForUser(req) {
  const localPath = req.file?.path;
  if (!localPath) throw new ApiError(400, "Video file is required (field: 'video')");

  const checksum = await fileChecksum(localPath);

  let video = await Video.findOne({ owner: req.user._id, checksum });
  let existing = false;

  if (!video) {
    const uploaded = await uploadOnCloudinary(localPath, "video");
    // always clean temp
    try { if (fs.existsSync(localPath)) fs.unlinkSync(localPath); } catch {}

    if (!uploaded?.secure_url || !uploaded?.public_id) {
      throw new ApiError(500, "Cloud upload failed");
    }

    video = await Video.create({
      owner: req.user._id,
      originalUrl: uploaded.secure_url,
      originalPublicId: uploaded.public_id,
      provider: "cloudinary",
      checksum,
      filename: path.basename(req.file.originalname || "video"),
      mimetype: req.file.mimetype || "",
    });
  } else {
    // new temp not needed (duplicate)
    try { if (fs.existsSync(localPath)) fs.unlinkSync(localPath); } catch {}
    existing = true;
  }

  return { video, existing };
}

/** ---------- controllers ---------- **/

// POST /api/v1/feature-history/unique-counts
export const uniqueCountsViaUpload = asyncHandler(async (req, res) => {
  const { video, existing } = await ensureVideoForUser(req);

  // 1) reuse cached
  if (Array.isArray(video.uniqueCounts) && video.uniqueCounts.length) {
    await FeatureHistory.create({
      user: req.user._id,
      video: video._id,
      type: "UNIQUE_COUNT",
      input: {},
      output: { uniqueCounts: video.uniqueCounts },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videoId: video._id,
          existingVideo: existing,
          message: "Reused cached unique counts",
          feature: { uniqueCounts: video.uniqueCounts },
        },
        "OK"
      )
    );
  }

  // 2) run python
  const py = spawn("python3", [
    path.resolve("python/unique_counter.py"),
    "--input", video.originalUrl,
    "--weights", process.env.YOLO_WEIGHTS,
    "--config", process.env.YOLO_CFG,
    "--names", process.env.YOLO_NAMES,
  ]);

  let out = "", err = "";
  py.stdout.on("data", d => out += d.toString());
  py.stderr.on("data", d => err += d.toString());

  py.on("close", async (code) => {
    if (code !== 0) {
      return res.status(500).json(new ApiResponse(500, { stderr: err }, "Unique counter failed"));
    }

    const parsed = parsePythonJson(out, "JSON_UNIQUE_OUTPUT::");
    if (!parsed.ok) {
      return res.status(500).json(new ApiResponse(500, { out, err }, parsed.error));
    }

    const uniqueCounts = parsed.json.uniqueCounts || [];

    // cache on Video
    video.uniqueCounts = uniqueCounts;
    video.uniqueCountsComputedAt = new Date();
    await video.save();

    // history
    await FeatureHistory.create({
      user: req.user._id,
      video: video._id,
      type: "UNIQUE_COUNT",
      input: {},
      output: { uniqueCounts },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videoId: video._id,
          existingVideo: existing,
          message: existing ? "Video existed; counts computed now" : "Uploaded & counts computed",
          feature: { uniqueCounts },
        },
        "OK"
      )
    );
  });
});

// POST /api/v1/feature-history/graph
export const graphViaUpload = asyncHandler(async (req, res) => {
  const { video, existing } = await ensureVideoForUser(req);

  let { limit = 200, classes = [] } = req.body;
  if (typeof classes === "string") {
    classes = classes.split(",").map(s => s.trim()).filter(Boolean);
  } else if (!Array.isArray(classes)) {
    classes = [];
  }

  const args = [
    path.resolve("python/graph_analyzer.py"),
    "--input", video.originalUrl,
    "--weights", process.env.YOLO_WEIGHTS,
    "--config", process.env.YOLO_CFG,
    "--names", process.env.YOLO_NAMES,
    "--limit", String(limit),
  ];
  if (classes.length) args.push("--classes", ...classes);

  const py = spawn("python3", args);

  let out = "", err = "";
  py.stdout.on("data", d => out += d.toString());
  py.stderr.on("data", d => err += d.toString());

  py.on("close", async (code) => {
    if (code !== 0) {
      return res.status(500).json(new ApiResponse(500, { stderr: err }, "Graph analyzer failed"));
    }

    const parsed = parsePythonJson(out, "JSON_GRAPH_OUTPUT::");
    if (!parsed.ok) {
      return res.status(500).json(new ApiResponse(500, { out, err }, parsed.error));
    }

    const payload = parsed.json;

    await FeatureHistory.create({
      user: req.user._id,
      video: video._id,
      type: "GRAPH",
      input: { limit: Number(limit), classes },
      output: {
        summary: {
          frames: Array.isArray(payload.frames) ? payload.frames.length : 0,
          seriesCount: payload.series ? Object.keys(payload.series).length : 0,
        },
      },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videoId: video._id,
          existingVideo: existing,
          message: existing ? "Video existed; graph computed" : "Uploaded & graph computed",
          feature: { graph: payload }, // { frames:[], series:{cls:[...]}}
        },
        "OK"
      )
    );
  });
});

// POST /api/v1/feature-history/bbox
export const bboxViaUpload = asyncHandler(async (req, res) => {
  const { video, existing } = await ensureVideoForUser(req);

  // reuse cached bbox
  if (video.bboxVideoUrl) {
    await FeatureHistory.create({
      user: req.user._id,
      video: video._id,
      type: "BBOX",
      input: {},
      output: { bboxVideoUrl: video.bboxVideoUrl },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videoId: video._id,
          existingVideo: existing,
          message: "Reused cached bbox video",
          feature: { bboxVideoUrl: video.bboxVideoUrl },
        },
        "OK"
      )
    );
  }

  const py = spawn("python3", [
    path.resolve("python/bbox_generator.py"),
    "--input", video.originalUrl,
    "--weights", process.env.YOLO_WEIGHTS,
    "--config", process.env.YOLO_CFG,
    "--names", process.env.YOLO_NAMES,
  ]);

  let out = "", err = "";
  py.stdout.on("data", d => out += d.toString());
  py.stderr.on("data", d => err += d.toString());

  py.on("close", async (code) => {
    if (code !== 0) {
      return res.status(500).json(new ApiResponse(500, { stderr: err }, "BBox generator failed"));
    }

    const parsed = parsePythonJson(out, "JSON_BBOX_OUTPUT::");
    if (!parsed.ok) {
      return res.status(500).json(new ApiResponse(500, { out, err }, parsed.error));
    }

    const localOut = parsed.json.output_path;
    if (!localOut || !fs.existsSync(localOut)) {
      return res.status(500).json(new ApiResponse(500, {}, "BBox output file missing"));
    }

    const up = await uploadOnCloudinary(localOut, "video");
    try { if (fs.existsSync(localOut)) fs.unlinkSync(localOut); } catch {}

    if (!up?.secure_url || !up?.public_id) {
      return res.status(500).json(new ApiResponse(500, {}, "Cloud upload failed for bbox video"));
    }

    video.bboxVideoUrl = up.secure_url;
    video.bboxVideoPublicId = up.public_id;
    video.bboxGeneratedAt = new Date();
    await video.save();

    await FeatureHistory.create({
      user: req.user._id,
      video: video._id,
      type: "bbox",
      input: {},
      output: { bboxVideoUrl: video.bboxVideoUrl },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videoId: video._id,
          existingVideo: existing,
          message: existing ? "Video existed; bbox generated" : "Uploaded & bbox generated",
          feature: { bboxVideoUrl: video.bboxVideoUrl },
        },
        "OK"
      )
    );
  });
});

// GET /api/v1/feature-history
export const listMyFeatureHistory = asyncHandler(async (req, res) => {
  const items = await FeatureHistory
    .find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();

  return res.status(200).json(new ApiResponse(200, items, "History fetched"));
});
