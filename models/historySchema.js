import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  amyloidosisTypes: {
    type: [String],
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  treatmentHistory: String,
  currentMedications: [String],
  familyHistory: String,
  lifestyleFactors: [String],
});

export const PatientHistory = mongoose.model("PatientHistory", historySchema);
