// // src/routes/featureHistory.routes.js
// import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { uploadVideo } from "../middlewares/multer.middleware.js";
// import { handleMulterError } from "../middlewares/multerError.middleware.js";

// import {
//   uniqueCountsViaUpload,
//   graphViaUpload,
//   bboxViaUpload,
//   listMyFeatureHistory,
// } from "../controllers/featureHistory.controller.js";

// const router = Router();

// router.get("/", verifyJWT, listMyFeatureHistory);

// router.post(
//   "/unique-counts",
//   verifyJWT,
//   uploadVideo.single("video"),
//   handleMulterError,
//   uniqueCountsViaUpload
// );

// router.post(
//   "/graph",
//   verifyJWT,
//   uploadVideo.single("video"),
//   handleMulterError,
//   graphViaUpload
// );

// router.post(
//   "/bbox",
//   verifyJWT,
//   uploadVideo.single("video"),
//   handleMulterError,
//   bboxViaUpload
// );

// export default router;
// routes/feature.uniqueCount.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  runUniqueCountPipeline,
  listUniqueCountCards,
  getUniqueCountHistory,
  deleteUniqueCountHistory,
  showUniqueCountChoices,
} from "../controllers/feature.uniqueCount.controller.js";

const router = Router();
router.use(verifyJWT);

router.post("/run/:videoId", runUniqueCountPipeline);
router.get("/cards", listUniqueCountCards);
router.get("/:id", getUniqueCountHistory);
router.delete("/:id", deleteUniqueCountHistory);
router.get("/choices/all", showUniqueCountChoices);

export default router;
