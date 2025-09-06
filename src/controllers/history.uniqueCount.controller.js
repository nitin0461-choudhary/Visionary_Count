// // controllers/feature.uniqueCount.controller.js
// import fs from "fs";
// import path from "path";
// import https from "https";
// import crypto from "crypto";
// import mongoose from "mongoose";
// import { spawn } from "child_process";
// import mongoose from "mongoose"
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { UniqueCountHistory } from "../models/history.uniqueCount.model.js";
// import { Video } from "../models/video.model.js";

// /* ------------------------------ config/env ------------------------------ */
// const PYTHON_BIN   = process.env.PYTHON_BIN     || "python3";
// const PY_SCRIPTS_DIR = process.env.PY_SCRIPTS_DIR || "./python";

// const YOLO_WEIGHTS = process.env.YOLO_WEIGHTS   || "./python/assets/yolov4.weights";
// const YOLO_CFG     = process.env.YOLO_CFG       || "./python/assets/yolov4.cfg";
// const YOLO_NAMES   = process.env.YOLO_NAMES     || "./python/assets/coco.names";

// /* =============================== CONTROLLERS ============================ */

// /**
//  * POST /api/feature/unique-count/run/:videoId
//  * Body (JSON):
//  * {
//  *   "classes":        string[] (optional),
//  *   "conf":           number   (optional),
//  *   "nms":            number   (optional),
//  *   "sample_rate":    number   (optional, default in py=5),
//  *   "max_disappeared":number   (optional, default in py=20),
//  *   "max_distance":   number   (optional, default in py=60),
//  *   "artifacts":      array    (optional; pre-uploaded Cloudinary assets)
//  * }
//  *
//  * Returns:
//  * {
//  *   "historyId": "...",
//  *   "countsByClass": { "person": 3, "car": 1, ... },
//  *   "cached": boolean
//  * }
//  */
// export const runUniqueCountPipeline = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   const { videoId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(videoId)) {
//     throw new ApiError(400, "Invalid videoId");
//   }

//   // inputs
//   const {
//     classes = [],
//     conf = null,
//     nms = null,
//     sample_rate = null,
//     max_disappeared = null,
//     max_distance = null,
//     artifacts = [],
//   } = req.body || {};

//   const inputParams = {
//     classes,
//     conf,
//     nms,
//     sample_rate,
//     max_disappeared,
//     max_distance,
//   };

//   // Validate video
//   const video = await Video.findOne({ _id: videoId, owner, deleted: false })
//     .select("_id title cloudinary.url");
//   if (!video) throw new ApiError(404, "Video not found or deleted");

//   // Idempotency: if identical params already exist for this video, reuse
//   const existing = await UniqueCountHistory.findOne({
//     owner,
//     video: video._id,
//     "inputParams.classes": { $eq: classes },
//     "inputParams.conf": conf,
//     "inputParams.nms": nms,
//     "inputParams.sample_rate": sample_rate,
//     "inputParams.max_disappeared": max_disappeared,
//     "inputParams.max_distance": max_distance,
//   }).select("_id countsByClass createdAt");

//   if (existing) {
//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           { historyId: existing._id, countsByClass: existing.countsByClass, cached: true },
//           "OK"
//         )
//       );
//   }

//   // Download → run python → parse JSON → persist
//   const localIn = await downloadToTemp(video.cloudinary.url, ".mp4");
//   try {
//     const args = [
//       "--input", localIn,
//       "--weights", YOLO_WEIGHTS,
//       "--config", YOLO_CFG,
//       "--names", YOLO_NAMES,
//     ];
//     if (Array.isArray(classes) && classes.length) args.push("--classes", ...classes);
//     if (conf != null)           args.push("--conf", String(conf));
//     if (nms != null)            args.push("--nms", String(nms));
//     if (sample_rate != null)    args.push("--sample_rate", String(sample_rate));
//     if (max_disappeared != null)args.push("--max_disappeared", String(max_disappeared));
//     if (max_distance != null)   args.push("--max_distance", String(max_distance));

//     const { stdout } = await runPython("unique_counter.py", args);

//     // Expect marker: JSON_UNIQUE_COUNTS::<json>
//     const countsByClass = extractJsonAfterMarker(stdout, "JSON_UNIQUE_COUNTS::");

//     const history = await UniqueCountHistory.create({
//       owner,
//       video: video._id,
//       inputParams,
//       countsByClass,
//       artifacts: Array.isArray(artifacts) ? artifacts : [],
//     });

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           { historyId: history._id, countsByClass, cached: false },
//           "Generated"
//         )
//       );
//   } finally {
//     safeUnlink(localIn);
//   }
// });
// export const listOfCardsDetailsOfHistoryFeature=asyncHandler(async(req,res)=>{
//     const owner=req.user._id;
//     if(!owner){
//       throw ApiError(404,"User does not exist");
//     }
//     const docs=await UniqueCountHistory.find({owner}).sort({createdAt:-1});
//     if(docs.length==0){
//       return res.status(201).
//       json(
//         201,
//         {},
//         "List is empty"
//       )
//     }
//     else{
//       return res.status(201).
//       json(
//         201,
//         {},
//         "List is all the cards of the user"
//       )
//     }
// });
// /**
//  * GET /api/feature/unique-count/cards
//  * Returns history cards (countsFiltered > 0 for clean UI).
//  */
// // export const listUniqueCountCards = asyncHandler(async (req, res) => {
// //   const owner = req.user._id;

// //   const docs = await UniqueCountHistory.find({ owner })
// //     .select("_id video createdAt countsByClass inputParams")
// //     .populate("video", "title cloudinary.url")
// //     .sort({ createdAt: -1 })
// //     .lean();

// //   const cleaned = docs.map((d) => {
// //     const filtered = {};
// //     for (const [k, v] of Object.entries(d.countsByClass || {})) {
// //       if ((v || 0) > 0) filtered[k] = v;
// //     }
// //     return { ...d, countsFiltered: filtered };
// //   });

// //   return res.json(new ApiResponse(200, cleaned));
// // });

// /**
//  * GET /api/feature/unique-count/:id
//  * Returns full history record.
//  */
// export const getUniqueCountHistory = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   const { id } = req.params;

//   const doc = await UniqueCountHistory.findOne({ _id: id, owner })
//     .populate("video", "title cloudinary.url createdAt");

//   if (!doc) throw new ApiError(404, "History not found");

//   return res.json(new ApiResponse(200, doc,"History of Unique Count Feature"));
// });

// /**
//  * DELETE /api/feature/unique-count/:id
//  * Permanently delete a unique-count history (hard delete).
//  * (No Cloudinary destroys here; if you store artifacts with public_id, add cleanup similarly to bbox.)
//  */
// export const deleteUniqueCountHistory = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   const { id } = req.params;

//   const doc = await UniqueCountHistory.findOneAndDelete({ _id: id, owner });
//   if (!doc) throw new ApiError(404, "History not found");
//   else{
//    return res.json(new ApiResponse(200,"History permanently deleted"));
//   }
//   // Optional: clean up artifact assets on Cloudinary if you saved any
//   // for (const a of doc.artifacts || []) { if (a.public_id) await destroyOnCloudinary(a.public_id, a.resource_type || "auto"); }

  

  
// });

// /**
//  * GET /api/feature/unique-count/choices
//  * Videos not yet processed for unique count (LEFT JOIN style).
//  */
// export const showUniqueCountChoices = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   // videos that already have at least one unique-count run
//   const processedIds = await UniqueCountHistory.distinct("video", { owner });

//   const videos = await Video.find({
//     owner,
//     deleted: false,
//     _id: { $nin: processedIds },
//   })
//     .select("_id title cloudinary.url createdAt")
//     .sort({ createdAt: -1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, videos || [], "List of videos for choices"));
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
import { UniqueCountHistory } from "../models/history.uniqueCount.model.js";
import { Video } from "../models/video.model.js";

/* ------------------------------ config ------------------------------ */
const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
const PY_SCRIPTS_DIR = process.env.PY_SCRIPTS_DIR || "./python";
const YOLO_WEIGHTS = process.env.YOLO_WEIGHTS || "./python/assets/yolov4.weights";
const YOLO_CFG = process.env.YOLO_CFG || "./python/assets/yolov4.cfg";
const YOLO_NAMES = process.env.YOLO_NAMES || "./python/assets/coco.names";

const TEMP_DIR = path.resolve("./public/temp");

/* ------------------------------ fs utils ------------------------------ */
function ensureTempDir() {
  try {
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch {}
}
ensureTempDir();

const safeUnlink = (p) => {
  try {
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
  } catch {}
};

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

function parseTaggedJson(stdout, marker) {
  const idx = stdout.lastIndexOf(marker);
  if (idx === -1) throw new Error(`Marker not found: ${marker}`);
  const jsonStr = stdout.slice(idx + marker.length).trim();
  return JSON.parse(jsonStr);
}

/* ------------------------------ controllers ------------------------------ */

/**
 * POST /api/v1/historyUniqueCount/run/:videoId
 */
export const runUniqueCountPipeline = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid videoId");

  // normalize inputs
  const {
    classes = [],
    conf = null,
    nms = null,
    sample_rate = null,
    max_disappeared = null,
    max_distance = null,
    artifacts = [],
  } = req.body || {};

  const normClasses = Array.isArray(classes) ? [...new Set(classes)].sort() : [];
  const inputParams = {
    classes: normClasses,
    conf,
    nms,
    sample_rate,
    max_disappeared,
    max_distance,
  };

  // Validate video
  const video = await Video.findOne({ _id: videoId, owner, deleted: false }).select("_id title cloudinary.url");
  if (!video) throw new ApiError(404, "Video not found or deleted");

  // Idempotency
  const existing = await UniqueCountHistory.findOne({
    owner,
    video: video._id,
    "inputParams.classes": { $eq: normClasses },
    "inputParams.conf": conf,
    "inputParams.nms": nms,
    "inputParams.sample_rate": sample_rate,
    "inputParams.max_disappeared": max_disappeared,
    "inputParams.max_distance": max_distance,
  }).select("_id countsByClass createdAt");

  if (existing) {
    return res
      .status(200)
      .json(new ApiResponse(200, { historyId: existing._id, countsByClass: existing.countsByClass, cached: true }, "OK"));
  }

  // Run python
  const localIn = await downloadToTemp(video.cloudinary.url, ".mp4");
  try {
    const args = [
      "--input", localIn,
      "--weights", YOLO_WEIGHTS,
      "--config", YOLO_CFG,
      "--names", YOLO_NAMES,
    ];
    if (normClasses.length) args.push("--classes", ...normClasses);
    if (conf != null) args.push("--conf", String(conf));
    if (nms != null) args.push("--nms", String(nms));
    if (sample_rate != null) args.push("--sample_rate", String(sample_rate));
    if (max_disappeared != null) args.push("--max_disappeared", String(max_disappeared));
    if (max_distance != null) args.push("--max_distance", String(max_distance));

    const { stdout } = await runPython("unique_counter.py", args); // <-- your script name
    const countsByClass = parseTaggedJson(stdout, "JSON_UNIQUE_COUNTS::");

    const history = await UniqueCountHistory.create({
      owner,
      video: video._id,
      inputParams,
      countsByClass,
      //artifacts: Array.isArray(artifacts) ? artifacts : [],
       artifacts: Array.isArray(artifacts) ? artifacts : (artifacts ? [artifacts] : []),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { historyId: history._id, countsByClass, cached: false }, "Generated"));
  } finally {
    safeUnlink(localIn);
  }
});

/**
 * GET /api/v1/historyUniqueCount/cards
 */
export const listOfCardsDetailsOfHistoryFeature = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const docs = await UniqueCountHistory.find({ owner })
    .select("_id video createdAt countsByClass inputParams")
    .populate("video", "title cloudinary.url")
    .sort({ createdAt: -1 })
    .lean();
   console.log("docs in the list of cards=",docs)
  return res.status(200).json(new ApiResponse(200, docs, "List of unique-count history cards"));
});

/**
 * GET /api/v1/historyUniqueCount/:id
 */
export const getUniqueCountHistory = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  const doc = await UniqueCountHistory.findOne({ _id: id, owner }).populate("video", "title cloudinary.url createdAt");
  if (!doc) throw new ApiError(404, "History not found");

  return res.status(200).json(new ApiResponse(200, doc, "Unique-count history"));
});

/**
 * DELETE /api/v1/historyUniqueCount/:id
 */
export const deleteUniqueCountHistory = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  const doc = await UniqueCountHistory.findOneAndDelete({ _id: id, owner });
  if (!doc) throw new ApiError(404, "History not found");

  return res.status(200).json(new ApiResponse(200, { deleted: true }, "History permanently deleted"));
});

/**
 * GET /api/v1/historyUniqueCount/choices/list
 * Videos not yet processed for unique count
 */
export const showUniqueCountChoices = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const processedIds = await UniqueCountHistory.distinct("video", { owner });
  console.log("length of the in processedIds=",processedIds.length);
  const videos = await Video.find({ owner, deleted: false, _id: { $nin: processedIds } })
    .select("_id title cloudinary.url createdAt")
    .sort({ createdAt: -1 });
  console.log("length in the backend=",videos.length);  

  return res.status(200).json(new ApiResponse(200, videos || [], "List of videos for choices"));
});
