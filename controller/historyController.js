import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { PatientHistory } from "../models/historySchema.js";
import ErrorHandler from "../middlewares/error.js";
import XLSX from 'xlsx';

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

// Function to export patient histories as Excel
export const exportHistories = catchAsyncErrors(async (req, res, next) => {
  try {
    const histories = await PatientHistory.find();

    // Transform the data as needed
    const data = histories.map(history => ({
      firstName: history.firstName,
      lastName: history.lastName,
      dob: history.dob,
      gender: history.gender,
      amyloidosisTypes: history.amyloidosisTypes.join(", "),
      symptoms: history.symptoms.join(", "),
      treatmentHistory: history.treatmentHistory,
      currentMedications: history.currentMedications.join(", "),
      familyHistory: history.familyHistory,
      lifestyleFactors: history.lifestyleFactors.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histories");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set response headers
    res.setHeader("Content-Disposition", "attachment; filename=patient_histories.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    
    // Send the Excel file
    res.send(buffer);
  } catch (error) {
    return next(new ErrorHandler("Failed to export histories", 400));
  }
});

