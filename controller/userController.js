import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";

// Admin Login with fixed credentials
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Fixed admin credentials (hardcoded)
  const adminEmail = "admin@asgi.com";  // Replace with the actual fixed email
  const adminPassword = "2024Rdssdf#";   // Replace with the actual fixed password

  // Verify admin credentials
  if (email !== adminEmail || password !== adminPassword) {
    return next(new ErrorHandler("Invalid Admin Credentials!", 401));
  }

  // Generate token and set cookie
  const user = await User.findOne({ email, role: "Admin" });
  if (!user) {
    return next(new ErrorHandler("Admin Not Found!", 404));
  }

  generateToken(user, "Admin Logged In Successfully!", 200, res);
});

// Get all patients for admin
export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "Patient" });
  res.status(200).json({
    success: true,
    patients,
  });
});

// Logout Admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Patient Registration
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Patient",
  });
  
  generateToken(user, "User Registered!", 200, res);
});

// Patient Login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || role !== user.role || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid Email, Password or Role!", 400));
  }

  generateToken(user, "Login Successfully!", 201, res);
});

// Logout Patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
