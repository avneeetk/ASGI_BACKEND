import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";

const validateUserInput = (input) => {
  const { firstName, lastName, email, phone, dob, gender, password } = input;
  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
    throw new ErrorHandler("Please Fill Full Form!", 400);
  }
};

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const userInput = req.body;
  validateUserInput(userInput);

  const existingUser = await User.findOne({ email: userInput.email });
  if (existingUser) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    ...userInput,
    role: "Patient",
  });
  
  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("User Not Found With This Role!", 400));
  }

  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const userInput = req.body;

  validateUserInput(userInput);

  const existingAdmin = await User.findOne({ email: userInput.email });
  if (existingAdmin) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    ...userInput,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout functions
export const logoutAdmin = catchAsyncErrors(async (req, res) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
