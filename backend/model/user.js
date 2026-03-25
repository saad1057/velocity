const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    companyname: {
        type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'recruiter'],
      default: 'recruiter',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    companyCode: {
      type: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    picture: {
      data: { type: Buffer },
      contentType: { type: String }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;

