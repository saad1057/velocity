const EmailTemplate = require("../model/EmailTemplate");

const isMissingOrEmpty = (value) => {
  if (!value) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

const getAllTemplates = async (_req, res) => {
  const templates = await EmailTemplate.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: templates });
};

const createTemplate = async (req, res) => {
  try {
    const { name, subject, category } = req.body || {};

    if (isMissingOrEmpty(name) || isMissingOrEmpty(subject) || isMissingOrEmpty(category)) {
      return res.status(400).json({ error: "name, subject, and category are required" });
    }

    const created = await EmailTemplate.create({ name, subject, category });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to create template" });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, category } = req.body || {};

    const updateData = {};
    if (!isMissingOrEmpty(name)) updateData.name = name;
    if (!isMissingOrEmpty(subject)) updateData.subject = subject;
    if (!isMissingOrEmpty(category)) updateData.category = category;

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

