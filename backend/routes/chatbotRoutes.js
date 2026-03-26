const express = require("express");
const axios = require("axios");

const router = express.Router();

const SYSTEM_PROMPT = `You are the AI Assistant inside the Velocity web app (recruitment workflow).

Velocity features (what the user can see in the left sidebar):
- Dashboard: general area and actions like "Create Job Specification".
- Job Specifications: run searches for candidates using job-title/location/filters.
- Candidates: list of matched candidates returned by the backend.
- Email Templates: manage email templates (create/update/delete) for outreach.
- Resume Parser: upload/parse resumes (the backend does the parsing).
- Assessments + Analytics: show assessment/analytics pages (read-only guidance).

When the user asks for help:
1) Provide step-by-step guidance that matches the UI (which page/button to use).
2) If the user wants an email, draft a template body or subject + body that fits recruitment outreach.
3) If the user asks about automation, explain which backend endpoint/module is typically involved (without claiming it will run unless implemented).
4) Be concise, ask 1-2 clarifying questions if needed, and never promise hiring outcomes.`;

router.post("/chat", async (req, res) => {
  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Failed to get response from Gemini",
        details: "Missing GEMINI_API_KEY in backend/.env",
      });
    }

    // To avoid issues with role/content shapes, send the full conversation
    // as a single user prompt. This prevents Gemini from hanging on
    // unexpected `model`/`user` role formatting.
    const lastMessages = messages
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
      .slice(-12);

    const conversationText = lastMessages
      .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n");

    if (!conversationText.trim()) {
      return res.status(400).json({ error: "messages must include non-empty content" });
    }

    // Keep prompt size bounded to avoid long/slow requests.
    const MAX_CONVERSATION_CHARS = 6000;
    const boundedConversationText =
      conversationText.length > MAX_CONVERSATION_CHARS
        ? conversationText.slice(-MAX_CONVERSATION_CHARS)
        : conversationText;

    // Use a model that is known to support `generateContent` on v1beta.
    // (Your REST `models?key=` call shows Gemini 2.5 Flash supports it.)
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: boundedConversationText }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.35,
      },
    };

    const startedAt = Date.now();
    console.log("Gemini chat request started");
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000, // Prevent "Typing..." forever
    });
    console.log("Gemini chat request finished", { ms: Date.now() - startedAt });

    const reply =
      response?.data?.candidates?.[0]?.content?.parts?.map((p) => p?.text).filter(Boolean).join("") ||
      "";

    return res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: "Failed to get response from Gemini",
      details:
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        String(err),
    });
  }
});

module.exports = router;

