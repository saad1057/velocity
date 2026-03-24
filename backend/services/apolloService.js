const axios = require("axios");

const buildAndCallApollo = async (formData) => {
  const apolloPayload = {
    api_key: process.env.APOLLO_API_KEY,
    page: 1,
    per_page: Math.min(100, Math.max(1, Number(formData.per_page) || 25)),
  };

  const toCleanArray = (value) =>
    (Array.isArray(value) ? value : [])
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

  const personTitles = toCleanArray(formData.job_title);
  const personLocations = toCleanArray(formData.location);
  const seniority = toCleanArray(formData.seniority);
  const industries = toCleanArray(formData.industry);
  const companyRanges = toCleanArray(formData.company_size);
  const keywords = typeof formData.keywords === "string" ? formData.keywords.trim() : "";

  if (personTitles.length) apolloPayload.person_titles = personTitles;
  if (personLocations.length) apolloPayload.person_locations = personLocations;
  if (seniority.length) apolloPayload.person_seniority_tags = seniority;
  if (industries.length) apolloPayload.organization_industry_tag_ids = industries;
  if (companyRanges.length) apolloPayload.organization_num_employees_ranges = companyRanges;
  if (keywords) apolloPayload.q_keywords = keywords;

  if (formData.email_required) {
    apolloPayload.contact_email_status = ["verified"];
  }

  try {
    const response = await axios.post(
      "https://api.apollo.io/v1/mixed_people/search",
      apolloPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.people;
  } catch (error) {
    const apolloMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      (error?.response?.data ? JSON.stringify(error.response.data) : error.message);
    throw new Error("Apollo API error: " + apolloMessage);
  }
};

module.exports = {
  buildAndCallApollo,
};
