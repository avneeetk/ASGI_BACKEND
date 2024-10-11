import express from "express";
import {
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

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;
