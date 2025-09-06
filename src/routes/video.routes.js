// import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { uploadVideo as uploadVideoMw } from "../middlewares/multer.middleware.js";
// import { handleMulterError } from "../middlewares/multerError.middleware.js";

// import {
//   uploadVideo,
//   computeUniqueCounts,
//   generateBboxVideo,
//   runGraph,
//   getVideoHistory,
//   deleteVideo,
// } from "../controllers/video.controller.js";

// const router = Router();

// // upload new video
// router.post(
//   "/upload",
//   verifyJWT,
//   uploadVideoMw.single("video"),
//   handleMulterError,
//   uploadVideo
// );

// // feature routes
// router.post("/:videoId/unique-counts", verifyJWT, computeUniqueCounts);
// router.post("/:videoId/bbox", verifyJWT, generateBboxVideo);
// router.post("/:videoId/graph", verifyJWT, runGraph);

// // video history + deletion
// router.get("/:videoId/history", verifyJWT, getVideoHistory);
// router.delete("/:videoId", verifyJWT, deleteVideo);


// import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { uploadVideo as uploadVideoMw } from "../middlewares/multer.middleware.js";
// import { handleMulterError } from "../middlewares/multerError.middleware.js";
// import { uploadVideoCtrl ,listMyVideoCtrl,deleteVideoCtrl,} from "../controllers/video.controller.js";
// const router=Router();
// router.post('/upload',verifyJWT,uploadVideoMw.single("video"),uploadVideoCtrl);
// router.get('/Choice_list',verifyJWT,listMyVideoCtrl);
// router.post('/delete/:video',verifyJWT,deleteVideoCtrl);



// export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo as uploadVideoMw } from "../middlewares/multer.middleware.js";
import { handleMulterError } from "../middlewares/multerError.middleware.js";
import {
  uploadVideoCtrl,
  listMyVideosCtrl,   // <-- note plural 's'
  deleteVideoCtrl,
} from "../controllers/video.controller.js";

const router = Router();

// Upload a new video
router.post(
  "/upload",
  verifyJWT,
  uploadVideoMw.single("video"),
  handleMulterError,
  uploadVideoCtrl
);

// List my (not-deleted) videos
router.get("/list", verifyJWT, listMyVideosCtrl);

// Delete a video (soft delete)
router.delete("/:id", verifyJWT, deleteVideoCtrl);

export default router;

