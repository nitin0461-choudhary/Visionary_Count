// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { Router } from "express";
// import { runBboxPipeline,BboxCards,getBboxHistory,deleteBboxHistory,showChoices, } from '../controllers/history.bbox.controller.js';
// const router=Router();
// router.get('/bbox_view',verifyJWT,runBboxPipeline);
// router.get('/list_hist',verifyJWT,BboxCards);
// router.get('/bbox_hist/:id',verifyJWT,getBboxHistory);
// router.get('/delete_hist/:id',verifyJWT,deleteBboxHistory);
// router.get('/list_choices',verifyJWT,showChoices);
// export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  runBboxPipeline,
  BboxCards,
  getBboxHistory,
  deleteBboxHistory,
  showChoices,
} from "../controllers/history.bbox.controller.js";

const router = Router();

// Run bbox overlay pipeline for a video
router.post("/run/:videoId", verifyJWT, runBboxPipeline);

// List bbox history cards
router.get("/cards", verifyJWT, BboxCards);

// Get bbox history detail
router.get("/:id", verifyJWT, getBboxHistory);

// Delete bbox history
router.delete("/:id", verifyJWT, deleteBboxHistory);

// List videos available to run
router.get("/choices/list", verifyJWT, showChoices);

export default router;
