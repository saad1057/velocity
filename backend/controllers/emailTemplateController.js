const EmailTemplate = require("../model/EmailTemplate");

const isMissingOrEmpty = (value) => {
  if (!value) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

const buildFormalTemplateBody = (category, subject) => {
  const safeSubject = subject?.trim() || "this opportunity";
  const lowerCategory = (category || "").toLowerCase();

  if (lowerCategory.includes("offer")) {
    return `Dear [Candidate Name],

I hope you are doing well.

Following our recent discussions, I am pleased to extend an offer for the [Job Title] position at [Company Name]. Please find the key details of this offer attached/included for your review.

Kindly review the offer and let us know if you have any questions. We would appreciate your response by [Response Date].

We are excited about the possibility of you joining our team.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("rejection")) {
    return `Dear [Candidate Name],

Thank you for your interest in the [Job Title] position at [Company Name], and for taking the time to participate in our process.

After careful consideration, we have decided to move forward with another candidate whose profile is currently a closer fit for this role.

We appreciate your time and effort, and we encourage you to apply for future opportunities that align with your experience.

We wish you every success in your job search.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("interview")) {
    return `Dear [Candidate Name],

Thank you for your application for the [Job Title] role at [Company Name].

We would like to invite you to an interview to discuss your background and experience in more detail.

Please let us know your availability for the following time slots:
- [Option 1]
- [Option 2]
- [Option 3]

If these options are not suitable, feel free to suggest an alternative.

We look forward to speaking with you.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("accept")) {
    return `Dear [Hiring Manager Name],

I hope you are doing well.

I am writing to formally accept the offer for the [Job Title] position at [Company Name].

I confirm my intent to join the company and I look forward to contributing to the team.

Please let me know the next steps required to complete the onboarding process. I will be ready to begin on [Start Date] (or as otherwise confirmed).

Thank you once again for this opportunity.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("follow")) {
    return `Dear [Candidate Name],

I hope you are doing well.

I am following up regarding the [Job Title] application and the next steps in the process.

If there is any additional information you need from me, I would be happy to provide it.

Thank you for your time and consideration. I look forward to your update.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  return `Dear [Candidate Name],

I hope you are doing well.

I am writing regarding ${safeSubject}. We appreciate your continued interest and wanted to share an update with you.

Please let us know if you have any questions or require any additional information.

Thank you for your time.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
};

const getAllTemplates = async (_req, res) => {
  const templates = await EmailTemplate.find().sort({ createdAt: -1 });
  // Backward compatibility: older records may not have `body`.
  const normalized = (templates || []).map((t) => {
    const obj = typeof t.toObject === "function" ? t.toObject() : t;
    if (!obj.body || (typeof obj.body === "string" && obj.body.trim().length === 0)) {
      obj.body = buildFormalTemplateBody(obj.category, obj.subject);
    }
    return obj;
  });
  return res.json({ success: true, data: normalized });
};

const createTemplate = async (req, res) => {
  try {
    const { name, subject, category, body } = req.body || {};

    if (isMissingOrEmpty(name) || isMissingOrEmpty(subject) || isMissingOrEmpty(category)) {
      return res.status(400).json({ error: "name, subject, and category are required" });
    }

    const resolvedBody = isMissingOrEmpty(body) ? buildFormalTemplateBody(category, subject) : body.trim();
    const created = await EmailTemplate.create({ name, subject, category, body: resolvedBody });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to create template" });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, category, body } = req.body || {};

    const updateData = {};
    if (!isMissingOrEmpty(name)) updateData.name = name;
    if (!isMissingOrEmpty(subject)) updateData.subject = subject;
    if (!isMissingOrEmpty(category)) updateData.category = category;
    if (!isMissingOrEmpty(body)) updateData.body = body.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Provide at least one field to update" });
    }

    const updated = await EmailTemplate.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Template not found" });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to update template" });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EmailTemplate.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Template not found" });
    }
    return res.json({ success: true, data: deleted });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to delete template" });
  }
};

module.exports = {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};

