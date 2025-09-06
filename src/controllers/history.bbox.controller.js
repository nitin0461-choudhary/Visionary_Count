// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { BboxHistory } from "../models/history.bbox.model.js";
// import { Video } from "../models/video.model.js";
// import { TEMP_DIR,safeUnlink,downloadToTemp,runPython} from '../utils/runner.utils.js';
// const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
// const PY_SCRIPTS_DIR = process.env.PY_SCRIPTS_DIR || "./python";
// const YOLO_WEIGHTS = process.env.YOLO_WEIGHTS || "./python/assets/yolov4.weights";
// const YOLO_CFG = process.env.YOLO_CFG || "./python/assets/yolov4.cfg";
// const YOLO_NAMES = process.env.YOLO_NAMES || "./python/assets/coco.names";
// const TEMP_DIR = path.resolve("./public/temp");

// export const runBboxPipeline = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//  // const { videoId } = req.params;
//   const { videoId,classes = [], conf = null, nms = null, artifacts = [] } = req.body || {};
//   const inputParams = { classes, conf, nms };

//   if (!mongoose.Types.ObjectId.isValid(videoId)) {
//     throw new ApiError(400, "Invalid videoId");
//   }

//   // Load the source video (ensure not deleted)
//   const video = await Video.findOne({ _id: videoId, owner, deleted: false })
//     .select("_id title cloudinary.url");
//   if (!video) throw new ApiError(404, "Video not found or deleted");

//   // Idempotency: if identical params already exist for this video, reuse
//   const existing = await BboxHistory.findOne({
//     owner,
//     video: video._id,
//     deleted: false,
//     "inputParams.classes": { $eq: classes },
//     "inputParams.conf": conf,
//     "inputParams.nms": nms,
//   }).select("_id overlayVideo inputParams createdAt");

//   if (existing) {
//     return res.status(200).json(
//       new ApiResponse(200, { historyId: existing._id, overlayVideo: existing.overlayVideo, cached: true }, "OK")
//     );
//   }

//   // Download → run python → upload overlay
//   const localIn = await downloadToTemp(video.cloudinary.url, ".mp4");
//   const localOut = path.join(TEMP_DIR, `bbox-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.mp4`);

//   try {
//     const args = [
//       "--input", localIn,
//       "--output", localOut,
//       "--weights", YOLO_WEIGHTS,
//       "--config", YOLO_CFG,
//       "--names", YOLO_NAMES,
//     ];
//     if (Array.isArray(classes) && classes.length) args.push("--classes", ...classes);
//     if (conf != null) args.push("--conf", String(conf));
//     if (nms != null) args.push("--nms", String(nms));

//     await runPython("bbox_generator.py", args);

//     const overlayAsset = await uploadOnCloudinary(localOut, "video", "bbox-overlays");
//     if (!overlayAsset?.url || !overlayAsset?.public_id) {
//       throw new ApiError(500, "Failed to upload bbox overlay");
//     }

//     const history = await BboxHistory.create({
//       owner,
//       video: video._id,
//       inputParams,
//       overlayVideo: overlayAsset,
//       artifacts: Array.isArray(artifacts) ? artifacts : [],
//       deleted: false,
//     });

//     return res.status(201).json(
//       new ApiResponse(201, { historyId: history._id, overlayVideo: history.overlayVideo, cached: false }, "Generated")
//     );
//   } finally {
//     safeUnlink(localIn);
//     safeUnlink(localOut);
//   }
// });
// export const BboxCards=asyncHandler(async(req,res)=>{
//   const owner=req.user._id;
//   const docs=await BboxHistory.find({owner})
//   .select("_id video createdAt overlayVideo inputParams")
//   .populate("video","title cloudinary.url")
//   .sort({createdAt:-1})
//   return res.json(new ApiResponse(
//     200,
//     docs
//   ));
// });
// export const getBboxHistory=asyncHandler(async(req,res)=>{
//     const owner=req.user._id;
//     const { id }=req.params;
//     const doc=await BboxHistory.findOne({_id:id,owner})
//     .populate("video","title cloudinary.url createdAt");
//     if(!doc) {
//         throw new ApiError(404,"History not found");}
//         return res.json(
//             new ApiResponse(200,doc)
//         );

// });
// export const deleteBboxHistory=asyncHandler(
//     async(req,res)=>{
//     const owner=req.user._id;
//     const { id }=req.params;
//     const doc=await BboxHistory.findOne({
//          _id:id,
//          owner,
         
//     });
//     if(!doc){
//         throw new ApiError(404,"History not found");
//     }
//     await BboxHistory.deleteOne({_id:id,owner});
//     return res.json(new ApiResponse(
//         200,
//         {deleted:true},
//         "History permanently deleted"
//     ));
          

//     }
// );
// export const showChoices=asyncHandler(async(req,res)=>{
//     const ownerId=req.user._id;
//     const  processedIds=await BboxHistory.distinct("video",{
//         owner:ownerId,
        
//     });
//     const videos=await Video.find(
//         {
//             owner:ownerId,
//             deleted:false,
//             _id:{$nin:processedIds}
//         }
//     )
//     .select("_id title cloudinary.url createdAt")
//     .sort({createdAt:-1});
//     videos=videos||[];
//     return res.status(201)
//     .json(new ApiResponse(
//         201,
//         videos,
//         "List of videos for choices"
//     ))

// });
import fs from "fs";
import path from "path";
import https from "https";
import crypto from "crypto";
import mongoose from "mongoose";
import { spawn } from "child_process";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { BboxHistory } from "../models/history.bbox.model.js";
import { Video } from "../models/video.model.js";

/* ------------------------------ config ------------------------------ */
const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
const PY_SCRIPTS_DIR = process.env.PY_SCRIPTS_DIR || "./python";
const YOLO_WEIGHTS = process.env.YOLO_WEIGHTS || "./python/assets/yolov4.weights";
const YOLO_CFG = process.env.YOLO_CFG || "./python/assets/yolov4.cfg";
const YOLO_NAMES = process.env.YOLO_NAMES || "./python/assets/coco.names";
const TEMP_DIR = path.resolve("./public/temp");

/* ------------------------------ utils ------------------------------ */
function ensureTempDir() { try { if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true }); } catch {} }
ensureTempDir();

const safeUnlink = (p) => { try { if (p && fs.existsSync(p)) fs.unlinkSync(p); } catch {} };

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

/* ------------------------------ controllers ------------------------------ */

/**
 * POST /api/v1/historyBbox/run/:videoId
 */
export const runBboxPipeline = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid videoId");

  const { classes = [], conf = null, nms = null, artifacts = [] } = req.body || {};
  const normClasses = Array.isArray(classes) ? [...new Set(classes)].sort() : [];
  const inputParams = { classes: normClasses, conf, nms };

  const video = await Video.findOne({ _id: videoId, owner, deleted: false }).select("_id title cloudinary.url");
  if (!video) throw new ApiError(404, "Video not found or deleted");

  // Idempotency
  const existing = await BboxHistory.findOne({
    owner,
    video: video._id,
    deleted: false,
    "inputParams.classes": { $eq: normClasses },
    "inputParams.conf": conf,
    "inputParams.nms": nms,
  }).select("_id overlayVideo inputParams createdAt");

  if (existing) {
    return res
      .status(200)
      .json(new ApiResponse(200, { historyId: existing._id, overlayVideo: existing.overlayVideo, cached: true }, "OK"));
  }

  const localIn = await downloadToTemp(video.cloudinary.url, ".mp4");
  const localOut = path.join(TEMP_DIR, `bbox-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.mp4`);

  try {
    const args = [
      "--input", localIn,
      "--output", localOut,
      "--weights", YOLO_WEIGHTS,
      "--config", YOLO_CFG,
      "--names", YOLO_NAMES,
    ];
    if (normClasses.length) args.push("--classes", ...normClasses);
    if (conf != null) args.push("--conf", String(conf));
    if (nms != null) args.push("--nms", String(nms));

    await runPython("bbox_generator.py", args);

    const overlayAsset = await uploadOnCloudinary(localOut, "video", "bbox-overlays");
    if (!overlayAsset?.url || !overlayAsset?.public_id) throw new ApiError(500, "Failed to upload bbox overlay");

    const history = await BboxHistory.create({
      owner,
      video: video._id,
      inputParams,
      overlayVideo: overlayAsset,
      artifacts: Array.isArray(artifacts) ? artifacts : [],
      deleted: false,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { historyId: history._id, overlayVideo: history.overlayVideo, cached: false }, "Generated"));
  } finally {
    safeUnlink(localIn);
    safeUnlink(localOut);
  }
});

/**
 * GET /api/v1/historyBbox/cards
 */
export const BboxCards = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const docs = await BboxHistory.find({ owner, deleted: false })
    .select("_id video createdAt overlayVideo inputParams")
    .populate("video", "title cloudinary.url")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, docs, "BBox history cards"));
});

/**
 * GET /api/v1/historyBbox/:id
 */
export const getBboxHistory = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  const doc = await BboxHistory.findOne({ _id: id, owner }).populate("video", "title cloudinary.url createdAt");
  if (!doc) throw new ApiError(404, "History not found");

  return res.status(200).json(new ApiResponse(200, doc, "BBox history"));
});

/**
 * DELETE /api/v1/historyBbox/:id
 */
export const deleteBboxHistory = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  const doc = await BboxHistory.findOne({ _id: id, owner });
  if (!doc) throw new ApiError(404, "History not found");

  await BboxHistory.deleteOne({ _id: id, owner });
  return res.status(200).json(new ApiResponse(200, { deleted: true }, "History permanently deleted"));
});

/**
 * GET /api/v1/historyBbox/choices/list
 */
export const showChoices = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const processedIds = await BboxHistory.distinct("video", { owner, deleted: false });

  const videos = await Video.find({
    owner,
    deleted: false,
    _id: { $nin: processedIds },
  })
    .select("_id title cloudinary.url createdAt")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, videos || [], "List of videos for choices"));
});


