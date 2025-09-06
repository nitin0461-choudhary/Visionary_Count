// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
// import { fileChecksum } from "../utils/checksum.js";
// import { Video } from "../models/video.model.js";

// // Upload a video with checksum dedupe and Cloudinary store
// // Uses multer: uploadVideo.single("video")
// export const uploadVideoCtrl = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   const localPath = req.file?.path;
//   const { title = "", description = "" } = req.body || {};

//   if (!localPath) throw new ApiError(400, "Video file is required");

//   // Compute checksum for dedupe
//   const checksum = await fileChecksum(localPath); // sha256:contentReference[oaicite:0]{index=0}

//   // Check if this video already exists
//   const existing = await Video.findOne({ owner, checksum });

//   if (existing) {
//     if (existing.deleted) {
//       // If it was soft-deleted earlier → revive it
//       existing.deleted = false;
//       existing.title = title || existing.title; // optionally update title
//       existing.description = description || existing.description;
//       await existing.save();
//       return res
//         .status(200)
//         .json(new ApiResponse(200, existing, "Video restored successfully"));
//     } else {
//       // Already exists and is active → duplicate
//       return res
//         .status(200)
//         .json(new ApiResponse(200, { duplicate: true, video: existing }, "Video already exists"));
//     }
//   }

//   // Upload to Cloudinary (new video)
//   const up = await uploadOnCloudinary(localPath, "video", "videos"); // normalized fields:contentReference[oaicite:1]{index=1}
//   if (!up?.url || !up?.public_id) throw new ApiError(400, "Cloud upload failed");

//   const doc = await Video.create({
//     owner,
//     title: title || up.original_filename || "untitled",
//     description,
//     checksum,
//     cloudinary: {
//       url: up.url,
//       public_id: up.public_id,
//       resource_type: up.resource_type,
//       bytes: up.bytes,
//       width: up.width,
//       height: up.height,
//       format: up.format,
//       duration: up.duration,
//       original_filename: up.original_filename,
//     },
//   });

//   return res.status(201).json(new ApiResponse(201, doc, "Video uploaded"));
// });

// // List my uploaded videos (not deleted)
// export const listMyVideosCtrl = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   const docs = await Video.find({ owner, deleted: false }).sort({ createdAt: -1 });
//   return res.json(new ApiResponse(200, docs));
// });

// // Delete a video (soft delete only)
// export const deleteVideoCtrl = asyncHandler(async (req, res) => {
//   const owner = req.user._id;
//   const { id } = req.params;
//   const { withList = "false" } = req.query;

//   const doc = await Video.findOne({ _id: id, owner, deleted: false });
//   if (!doc) throw new ApiError(404, "Video not found");

//   doc.deleted = true;
//   await doc.save();

//   let list;
//   if (withList === "true") {
//     list = await Video.find({ owner, deleted: false })
//       .select("_id title cloudinary.url createdAt")
//       .sort({ createdAt: -1 });
//   }

//   return res.json(
//     new ApiResponse(200, { deleted: true, videos: list }, "Video deleted")
//   );
// });
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { fileChecksum } from "../utils/checksum.js";
import { Video } from "../models/video.model.js";

/**
 * POST /api/v1/videos/upload
 * Body: multipart/form-data with field "video"
 */
export const uploadVideoCtrl = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const localPath = req.file?.path;
  const { title = "", description = "" } = req.body || {};

  if (!localPath) throw new ApiError(400, "Video file is required");

  // Compute checksum for dedupe
  const checksum = await fileChecksum(localPath);
  console.log("Checksum=",checksum);
  // Existing?
  const existing = await Video.findOne({ owner, checksum });
  console.log("Existing=",existing);
  if (existing) {
    if (existing.deleted) {
      existing.deleted = false;
      existing.title = title || existing.title;
      existing.description = description || existing.description;
      await existing.save();
      return res
        .status(200)
        .json(new ApiResponse(200, existing, "Video restored successfully"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { duplicate: true, video: existing }, "Video already exists"));
  }

  // Upload to Cloudinary
  const up = await uploadOnCloudinary(localPath, "video", "videos");
  if (!up?.url || !up?.public_id) throw new ApiError(400, "Cloud upload failed");
  console.log("up of cloudinary=",up);
  const doc = await Video.create({
    owner,
    title: title || up.original_filename || "untitled",
    description,
    checksum,
    cloudinary: {
      url: up.url,
      public_id: up.public_id,
      resource_type: up.resource_type,
      bytes: up.bytes,
      width: up.width,
      height: up.height,
      format: up.format,
      duration: up.duration,
      original_filename: up.original_filename,
    },
  });

  return res.status(201).json(new ApiResponse(201, doc, "Video uploaded"));
});

/**
 * GET /api/v1/videos/list
 */
export const listMyVideosCtrl = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const docs = await Video.find({ owner, deleted: false }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, docs, "Videos fetched"));
});

/**
 * DELETE /api/v1/videos/:id
 */
export const deleteVideoCtrl = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  const doc = await Video.findOne({ _id: id, owner, deleted: false });
  if (!doc) throw new ApiError(404, "Video not found");

  doc.deleted = true;
  await doc.save();

  return res.status(200).json(new ApiResponse(200, { deleted: true }, "Video deleted"));
});

