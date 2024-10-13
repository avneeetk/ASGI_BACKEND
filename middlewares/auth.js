import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate the admin based on static credentials
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler("Admin is not authenticated!", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  // Since the admin is hardcoded, you don't need a role check, just ensure the token is valid
  if (!req.user) {
    return next(new ErrorHandler("Invalid token or user not found", 403));
  }
  
  next(); // Continue to the next middleware
});

// Middleware to authenticate all users (who are patients)
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.patientToken; // Ensure you are using the correct cookie name
  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 401)); // Change the error code to 401 for unauthorized
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("Invalid token or user not found", 403));
  }

  next(); // Proceed if user is authenticated
});

