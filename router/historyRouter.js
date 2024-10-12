import express from "express";
import { exportHistories, postPatientHistory, getAllPatientHistories } from "../controller/historyController.js";

const router = express.Router();

// Routes for patient history
router.post("/", postPatientHistory); // To create patient history
router.get("/", getAllPatientHistories); // To get all patient histories
router.get("/exportHistories", exportHistories); // To export patient histories as Excel

export default router;
