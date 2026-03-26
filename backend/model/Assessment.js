const mongoose = require("mongoose");

const assessmentQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 4,
        message: "Each question must include exactly 4 options",
      },
    },
    answer: { type: String, required: true },
    explanation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  { _id: false },
);

const assessmentSchema = new mongoose.Schema({
  jobSpecId: { type: mongoose.Schema.Types.ObjectId, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  jobTitle: { type: String, required: true },
  questions: { type: [assessmentQuestionSchema], required: true },
  generatedAt: { type: Date, default: Date.now },
  totalQuestions: { type: Number, required: true },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;
