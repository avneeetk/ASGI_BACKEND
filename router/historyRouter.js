import express from "express";
import {
  postPatientHistory,
  getAllPatientHistories,
} from "../controller/historyController.js";
import { isPatientAuthenticated } from "../middlewares/auth.js"; // Only patient authentication needed

const router = express.Router();

// POST route for adding patient history
router.post("/history", isPatientAuthenticated, postPatientHistory);

// GET route for fetching all patient histories (accessible to all authenticated users)
router.get("/getall", isPatientAuthenticated, getAllPatientHistories);

export default router;
