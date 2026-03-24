const apolloService = require("../services/apolloService");
const JobSpec = require("../models/JobSpec");

const isMissingOrEmpty = (value) => {
  if (!value) return true;
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim()).length === 0;
  }
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

const searchCandidates = async (req, res) => {
  try {
    const body = req.body || {};

    if (isMissingOrEmpty(body.job_title) || isMissingOrEmpty(body.location)) {
      return res.status(400).json({ error: "job_title and location are required" });
    }

    const candidates = await apolloService.buildAndCallApollo(body);

    const savedSpec = await JobSpec.create({
      jobTitle: body.job_title,
      location: body.location,
      seniority: body.seniority,
      industry: body.industry,
      companySize: body.company_size,
      keywords: body.keywords,
      emailRequired: body.email_required,
      perPage: body.per_page,
      postFilters: body.post_filters,
    });

    return res.json({ candidates: candidates || [], jobSpecId: savedSpec._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { searchCandidates };
