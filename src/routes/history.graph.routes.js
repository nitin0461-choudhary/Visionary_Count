// import { Router } from "express";
// import { verifyJWT } from '../middlewares/auth.middleware.js';
// import { runGraphCountsAllFrames,listOfCards,detailsForOneHistoryGraph,listOfChoices,deleteOneCardHistory } from '../controllers/history.graph.controller.js';

// const router=Router();
// router.get('/graph_view',verifyJWT,runGraphCountsAllFrames);
// router.get('/list_hist',verifyJWT,listOfCards);
// router.get('/graph_hist/:history_id',verifyJWT,detailsForOneHistoryGraph);
// router.get('/list_choices',verifyJWT,listOfChoices);
// router.post('/delete_hist/:history_id',verifyJWT,deleteOneCardHistory);
// export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  runGraphCountsAllFrames,
  listOfCards,
  detailsForOneHistoryGraph,
  listOfChoices,
  deleteOneCardHistory,
} from "../controllers/history.graph.controller.js";

const router = Router();

// Run pipeline for a video
router.post("/run/:videoId", verifyJWT, runGraphCountsAllFrames);

// List graph history "cards" for user
router.get("/cards", verifyJWT, listOfCards);

// Get one graph history detail
router.get("/:history_id", verifyJWT, detailsForOneHistoryGraph);

// List videos available to run (choices)
router.get("/choices/list", verifyJWT, listOfChoices);

// Delete one history record
router.delete("/:history_id", verifyJWT, deleteOneCardHistory);

export default router;
