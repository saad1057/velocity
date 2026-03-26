const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    candidateEmail: { type: String, required: true, lowercase: true, trim: true },
    candidateName: { type: String, default: "Candidate" },
    token: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["sent", "started", "submitted", "expired", "cancelled"],
      default: "sent",
    },
    startedAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    cancelledReason: { type: String, default: "" },
    expiresAt: { type: Date, required: true },
    answers: { type: Map, of: String, default: {} },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    antiCheat: {
      tabSwitchCount: { type: Number, default: 0 },
      fullScreenExitCount: { type: Number, default: 0 },
      visibilityHiddenCount: { type: Number, default: 0 },
      micPermissionGranted: { type: Boolean, default: false },
      cameraPermissionGranted: { type: Boolean, default: false },
      micTrackActive: { type: Boolean, default: false },
      cameraTrackActive: { type: Boolean, default: false },
      integrityNotes: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const ExamAttempt = mongoose.model("ExamAttempt", examAttemptSchema);
module.exports = ExamAttempt;
