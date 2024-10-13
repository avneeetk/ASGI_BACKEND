import express from "express";
import { postPatientHistory, getAllPatientHistories, exportHistories } from "../controller/historyController.js";
import { isPatientAuthenticated } from "../middlewares/auth.js"; // Import the authentication middleware

const router = express.Router();

// POST request for adding patient history
router.post("/add", isPatientAuthenticated, postPatientHistory); // Add the authentication middleware here
 // Add the authentication middleware here

// GET request for fetching all histories
router.get("/", getAllPatientHistories);

// GET request for exporting histories
router.get("/exportHistories", exportHistories);

export default router;
