import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { PatientHistory } from "../models/historySchema.js";
import ErrorHandler from "../middlewares/error.js";

// Function to post patient history
export const postPatientHistory = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    dob,
    gender,
    amyloidosisTypes,
    symptoms,
    treatmentHistory,
    currentMedications,
    familyHistory,
    lifestyleFactors,
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !dob || !gender || !amyloidosisTypes || !symptoms) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  const patientId = req.user._id;

  // Create a new patient history record
  const history = await PatientHistory.create({
    patientId,
    firstName,
    lastName,
    dob,
    gender,
    amyloidosisTypes,
    symptoms,
    treatmentHistory,
    currentMedications,
    familyHistory,
    lifestyleFactors,
  });

  res.status(201).json({
    success: true,
    message: "Patient history submitted successfully!",
    history,
  });
});

// Function to get all patient histories (accessible to all authenticated users)
export const getAllPatientHistories = catchAsyncErrors(async (req, res, next) => {
  const histories = await PatientHistory.find().populate('patientId', 'firstName lastName email phone dob');

  res.status(200).json({
    success: true,
    histories,
  });
});
