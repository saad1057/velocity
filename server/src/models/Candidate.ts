import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  jobId: mongoose.Types.ObjectId;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offered', 'rejected'],
      default: 'applied',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CandidateSchema.index({ jobId: 1 });
CandidateSchema.index({ email: 1 });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);

