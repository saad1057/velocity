import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  candidateId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  score?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AssessmentSchema.index({ candidateId: 1 });
AssessmentSchema.index({ jobId: 1 });

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);

