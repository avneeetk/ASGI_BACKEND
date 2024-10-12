import express from "express";
import {
  adminLogin,
  getAllPatients,
  getUserDetails,
  logoutAdmin,
  patientRegister,
  login,
  logoutPatient
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Admin routes
router.post("/admin/login", adminLogin);
router.get("/admin/patients", isAdminAuthenticated, getAllPatients);
router.get("/me", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", logoutAdmin);

// Patient routes
router.post("/patient/register", patientRegister);
router.post("/patient/login", login);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

export default router;
