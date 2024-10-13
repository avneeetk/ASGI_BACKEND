// historyRouter.js
import express from "express";
import { postPatientHistory, getAllPatientHistories, exportHistories } from "../controller/historyController.js";

const router = express.Router();

// POST request for adding patient history
router.post("/add", postPatientHistory);

// GET request for fetching all histories
router.get("/", getAllPatientHistories);

// GET request for exporting histories
router.get("/exportHistories", exportHistories);

export default router;
