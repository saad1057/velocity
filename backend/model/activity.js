const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    feature: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { 
    timestamps: true 
  }
);

// Performance indexes
activitySchema.index({ createdAt: -1 });
activitySchema.index({ feature: 1, createdAt: -1 });

const Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;
