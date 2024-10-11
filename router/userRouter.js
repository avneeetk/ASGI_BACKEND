import express from "express";
import {
  adminLogin,
  getAllPatients,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// Admin routes
router.post("/admin/login", adminLogin);
router.get("/admin/patients", isAdminAuthenticated, getAllPatients);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Patient routes
router.post("/patient/register", patientRegister);
router.post("/patient/login", login);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

export default router;
