// // controllers/feature.graph.controller.js
// import path from "path";
// import fs from "fs";

// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Video } from "../models/video.model.js";
// import { FeatureHistory } from "../models/featureHistory.model.js";
// import { downloadToTemp, runPython, parseTaggedJson, safeUnlink } from "../utils/runner.utils.js";
// import { GraphHistory } from "../models/history.graph.controller.js";
// import { raw } from "express";
// const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
// const PY_SCRIPTS_DIR = process.env.PY_SCRIPTS_DIR || "./python";
// const YOLO_WEIGHTS = process.env.YOLO_WEIGHTS || "./python/assets/yolov4.weights";
// const YOLO_CFG = process.env.YOLO_CFG || "./python/assets/yolov4.cfg";
// const YOLO_NAMES = process.env.YOLO_NAMES || "./python/assets/coco.names";

// async function runGraphPythonAll(localIn, { classes, sampleRate, conf, nms }) {
//   const args = [
//     "--input", localIn,
//     "--weights", YOLO_WEIGHTS,
//     "--config", YOLO_CFG,
//     "--names", YOLO_NAMES,
//   ];
//   if (Array.isArray(classes) && classes.length) args.push("--classes", ...classes);
//   if (sampleRate) args.push("--sample_rate", String(sampleRate));
//   if (conf != null) args.push("--conf", String(conf));
//   if (nms != null) args.push("--nms", String(nms));

//   const { stdout } = await runPython("graph_analyzer.py", args, { PYTHON_BIN, PY_SCRIPTS_DIR });
//   const parsed = parseTaggedJson(stdout, "JSON_FRAME_COUNTS::");
//   if (!parsed || !parsed.counts_by_frame) {
//     throw new ApiError(500, "Failed to parse per-frame counts");
//   }
//   return parsed; // { frames: number[], counts_by_frame: Record<string, Record<string, number>> }
// }

// /**
//  * POST /api/feature/graph/:videoId
//  * Body: { classes: string[], sampleRate?: number, conf?: number, nms?: number }
//  * Returns: { frames: number[], countsByFrame: { [frame: string]: { [className: string]: number } } }
//  */
// export const runGraphCountsAllFrames = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   const userId = req.user?._id;
//   const { classes} = req.body || {};
// const conf= 0.5;
// const nms= 0.4;
// const sampleRate = 1;
//   const video = await Video.findOne({ _id: videoId, owner: userId });
//   if (!video) throw new ApiError(404, "Video not found");

//   // Optional: validate class names exist in coco.names (otherwise they’ll just be zeros).
//   const localIn = await downloadToTemp(video.originalUrl, ".mp4");

//   try {
//     const pyOut = await runGraphPythonAll(localIn, { classes, sampleRate, conf, nms });

//     const video=await GraphHistory.create({
//       user: userId,
//       video: video._id,
      
//       params: {
//         classes: Array.isArray(classes) ? classes : [],
//         sampleRate: Number(sampleRate) || 1,
//         conf: conf != null ? Number(conf) : undefined,
//         nms: nms != null ? Number(nms) : undefined,
//       },
//       result: {
//         frames: pyOut.frames,
//         countsByFrame: pyOut.counts_by_frame,
//       },
//     });

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         video,
//         "Per-frame class counts for all frames ready"
//       )
//     );
//   } finally {
//     safeUnlink(localIn);
//   }
// });
// export const listOfCards=asyncHandler(async(req,res)=>{
//     const owner=req.user._id;
//     if(!owner){
//     throw new ApiError(404,"Invalied user");
//     }
//     const historyCardsDetails=await GraphHistory({owner:owner});
//     if(historyCardsDetails.length===0){
//         return res.status(201).json(new ApiResponse(201,{},"No History is there"));
//     }
//     else{
//         return res.status(201).json(new ApiResponse(201,historyCardsDetails,"No History is there"));
//     }
    
// });



// export const detailsForOneHistoryGraph=asyncHandler(async(req,res)=>{
// const owner=req.user._id;
// if(!owner){
//     throw new ApiError(404,"Invalied user");
// }
// const history_id=req.params;
// const {videoId}=req.body||[];
// if(!history_id && !videoId){
//  const historyCard=await GraphHistory({owner,videoId,_id:history_id});
//  if(!historyCard){
//     throw new ApiError(500,"Error during fetching the details from the database");
//  }
//  else{
//     return res.status(201)
//     .json(
//         201,
//         historyCard,
//         "History of this particullar one card"
//     );
//  }
// }
// else{
//     throw new ApiError(404,"Invalied request for the history point")
// }
// });
// export const listOfChoices=asyncHandler(async(req,res)=>{
//   const owner=req.user._id;
//   if(!owner){
//     throw new ApiError(404,"Invalid User in the graph controller choice functions")
//   }
//   const doc=await Video.find({owner:owner,deleted:false});
//   if(doc.length===0){
//     return res.status(201).json(
//         new ApiResponse(201,{},"List is empty")
//     );
    
//   }
//   else{
//     return res.satus(201).json(
//         new ApiResponse(201,
//             doc,
//             "List of all the availabel videos"
//         )
//     );
//   }
// });
// export const deleteOneCardHistory=asyncHandler(async(req,res)=>{
//  const owner=req.user._id;
//  if(!owner){
//     throw new ApiError(404,"Invalid user");
//  }
//  const history_id=req.params;
//  const { videoId }=req.body;
//  if(!videoId && !history_id){
//     throw ApiError(404,"invalid details");
//  }
//  const historyCard=await GraphHistory.findOneAndDelete({owner,videoId,history_id});
//  if(!historyCard){
//     throw new ApiError(404,"Invalid history card");
//  }
//  else{
//     return res.status(201).
//     json(
//         new ApiResponse(
//             201,
//             "Card deleted successfully"
//         )
//     );
//  }
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
import { Video } from "../models/video.model.js";
import { GraphHistory } from "../models/history.graph.model.js";

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

function parseTaggedJson(stdout, marker) {
  const idx = stdout.lastIndexOf(marker);
  if (idx === -1) throw new Error(`Marker not found: ${marker}`);
  const jsonStr = stdout.slice(idx + marker.length).trim();
  return JSON.parse(jsonStr);
}

/* ------------------------------ controllers ------------------------------ */

/**
 * POST /api/v1/historyGraph/run/:videoId
 * Body: { classes?: string[], sampleRate?: number, conf?: number, nms?: number }
 */
export const runGraphCountsAllFrames = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid videoId");

  const { classes = [], sampleRate = 1, conf = 0.5, nms = 0.4 } = req.body || {};

  const normClasses = Array.isArray(classes) ? [...new Set(classes)].sort() : [];

  const video = await Video.findOne({ _id: videoId, owner, deleted: false }).select("_id cloudinary.url title");
  if (!video) throw new ApiError(404, "Video not found");

  const localIn = await downloadToTemp(video.cloudinary.url, ".mp4");

  try {
    const args = [
      "--input", localIn,
      "--weights", YOLO_WEIGHTS,
      "--config", YOLO_CFG,
      "--names", YOLO_NAMES,
      "--sample_rate", String(sampleRate),
      "--conf", String(conf),
      "--nms", String(nms),
    ];
    if (normClasses.length) args.push("--classes", ...normClasses);

    const { stdout } = await runPython("graph_analyzer.py", args);
    const parsed = parseTaggedJson(stdout, "JSON_FRAME_COUNTS::");
    // parsed = { frames: number[], counts_by_frame: { "idx": { class: count } } }

    const history = await GraphHistory.create({
      owner,
      video: video._id,
      inputParams: { classes: normClasses, sampleRate, conf, nms },
      graphData: {
        frames: parsed.frames,
        countsByFrame: parsed.counts_by_frame,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, history, "Per-frame class counts ready"));
  } finally {
    safeUnlink(localIn);
  }
});

/**
 * GET /api/v1/historyGraph/cards
 */
export const listOfCards = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const cards = await GraphHistory.find({ owner, deleted: false })
    .select("_id video createdAt inputParams")
    .populate("video", "title cloudinary.url")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, cards, "Graph history cards"));
});

/**
 * GET /api/v1/historyGraph/:history_id
 */
export const detailsForOneHistoryGraph = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { history_id } = req.params;

  const doc = await GraphHistory.findOne({ _id: history_id, owner })
    .populate("video", "title cloudinary.url createdAt");
  if (!doc) throw new ApiError(404, "History not found");

  return res.status(200).json(new ApiResponse(200, doc, "Graph history detail"));
});

/**
 * GET /api/v1/historyGraph/choices/list
 */
export const listOfChoices = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const processed = await GraphHistory.distinct("video", { owner, deleted: false });

  const videos = await Video.find({ owner, deleted: false, _id: { $nin: processed } })
    .select("_id title cloudinary.url createdAt")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, videos, "List of videos for graph choices"));
});

/**
 * DELETE /api/v1/historyGraph/:history_id
 */
export const deleteOneCardHistory = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { history_id } = req.params;

  const doc = await GraphHistory.findOneAndDelete({ _id: history_id, owner });
  if (!doc) throw new ApiError(404, "History not found");

  return res.status(200).json(new ApiResponse(200, { deleted: true }, "Graph history deleted"));
});

