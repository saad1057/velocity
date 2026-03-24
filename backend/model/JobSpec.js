const mongoose = require("mongoose");

const jobSpecSchema = new mongoose.Schema({
  jobTitle: [String],
  location: [String],
  seniority: [String],
  industry: [String],
  companySize: [String],
  keywords: String,
  emailRequired: Boolean,
  perPage: Number,
  postFilters: {
    skills: [String],
    minExperienceYears: Number,
    education: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const JobSpec = mongoose.model("JobSpec", jobSpecSchema);
module.exports = JobSpec;
