const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful recruitment assistant for Velocity.
Your job is to assist candidates by answering questions about:
- Job roles and requirements
- The application process
- Interview tips and preparation
- Company culture and benefits

Be professional, concise, and encouraging. Do not make promises about hiring outcomes.`;

router.post("/chat", async (req, res) => {
  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = response?.content?.[0]?.text;
    return res.json({ reply: reply || "" });
  } catch (err) {
    console.error("Claude API error:", err);
    return res.status(500).json({ error: "Failed to get response from Claude" });
  }
});

module.exports = router;

