import express from "express";
import {
  postPatientHistory,
  getAllPatientHistories,
  exportPatientHistories,
} from "../controller/historyController.js";
import { isPatientAuthenticated } from "../middlewares/auth.js"; // Authentication middleware

const router = express.Router();

// Routes for patient history
router.post("/history", isPatientAuthenticated, postPatientHistory);
router.get("/getall", isPatientAuthenticated, getAllPatientHistories);

// New route to export histories for Excel download
router.get("/exportHistories", isPatientAuthenticated, exportPatientHistories);

export default router;
