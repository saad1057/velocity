const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/emailTemplateController");

const router = express.Router();

// Require auth for managing templates
router.use(authenticate);

router.get("/", getAllTemplates);
router.post("/", createTemplate);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;

