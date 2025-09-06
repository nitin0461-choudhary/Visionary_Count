// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { Router } from "express";
// import { runUniqueCountPipeline ,listOfCardsDetailsOfHistoryFeature,getUniqueCountHistory,deleteUniqueCountHistory,showUniqueCountChoices } from "../controllers/history.uniqueCount.controller.js";
// const router=Router();
// router.get('/unique_count_view/:id',verifyJWT,runUniqueCountPipeline);
// router.get('/list_hist',verifyJWT,listOfCardsDetailsOfHistoryFeature);
// router.get('/unique_count_hist/:id',verifyJWT,getUniqueCountHistory);
// router.post('/delete_hist/:id',verifyJWT,deleteUniqueCountHistory);
// router.get('/list_choices',verifyJWT,showUniqueCountChoices);
// export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  runUniqueCountPipeline,
  listOfCardsDetailsOfHistoryFeature, // your current list fn
  getUniqueCountHistory,
  deleteUniqueCountHistory,
  showUniqueCountChoices,
} from "../controllers/history.uniqueCount.controller.js";

const router = Router();

// Run pipeline for a video (POST, has body)
router.post("/run/:videoId", verifyJWT, runUniqueCountPipeline);

// List history "cards" for current user
router.get("/cards", verifyJWT, listOfCardsDetailsOfHistoryFeature);

// History details by id
router.get("/:id", verifyJWT, getUniqueCountHistory);

// Delete a history record
router.delete("/:id", verifyJWT, deleteUniqueCountHistory);

// Videos available to run (not yet processed)
router.get("/choices/list", verifyJWT, showUniqueCountChoices);

export default router;
