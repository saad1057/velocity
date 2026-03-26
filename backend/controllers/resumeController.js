require('dotenv').config();
const axios = require('axios');

/**
 * Proxy to Python pyresparser microservice (ai-service/app.py).
 * Expects JSON body: { documentBase64, fileName? }
 */
const parseResumePy = async (req, res) => {
  try {
    const { documentBase64, fileName, position, description } = req.body || {};

    if (!documentBase64) {
      return res.status(400).json({
        success: false,
        message: 'documentBase64 is required (base64-encoded PDF/DOCX)',
      });
    }

    const baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    const response = await axios.post(
      `${baseUrl}/parse`,
      { documentBase64, fileName },
      { timeout: 30000 }
    );

    const parsed = response.data?.data ?? response.data;

    const insights = await buildResumeInsights({
      parsed,
      position,
      description,
    });

    return res.status(response.status || 200).json({
      success: response.data?.success ?? true,
      data: {
        ...(parsed || {}),
        insights,
      },
      message: response.data?.message,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Failed to parse resume';

    // Log detailed error server-side for troubleshooting
    console.error(
      '[resume.parse] error',
      {
        status,
        message,
        responseData: err.response?.data,
      }
    );

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'have',
  'he',
  'her',
  'his',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'may',
  'or',
  'our',
  'she',
  'should',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'to',
  'us',
  'was',
  'we',
  'were',
  'will',
  'with',
  'you',
  'your',
  'job',
  'role',
  'position',
  'experience',
  'skills',
  'skill',
]);

const tokenize = (text) => {
  const t = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return [];
  return t
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w && w.length > 1 && !STOP_WORDS.has(w));
};

const computeTfIdfCosineSimilarity = (docA, docB) => {
  const tokensA = tokenize(docA);
  const tokensB = tokenize(docB);

  if (!tokensA.length || !tokensB.length) return 0;

  const tf = (tokens) => {
    const m = new Map();
    for (const tok of tokens) m.set(tok, (m.get(tok) || 0) + 1);
    return m;
  };

  const tfA = tf(tokensA);
  const tfB = tf(tokensB);

  const vocab = new Set([...tfA.keys(), ...tfB.keys()]);

  // N=2 documents for idf.
  const idf = (term) => {
    const df = (tfA.has(term) ? 1 : 0) + (tfB.has(term) ? 1 : 0);
    // Smooth:
    return Math.log((1 + 2) / (1 + df)) + 1;
  };

  const tfidf = (tfMap) => {
    const m = new Map();
    for (const term of vocab) {
      const count = tfMap.get(term) || 0;
      if (!count) continue;
      m.set(term, count * idf(term));
    }
    return m;
  };

  const vA = tfidf(tfA);
  const vB = tfidf(tfB);

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const [, val] of vA) normA += val * val;
  for (const [, val] of vB) normB += val * val;

  if (!normA || !normB) return 0;
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  const [small, large] = vA.size < vB.size ? [vA, vB] : [vB, vA];
  for (const [term, val] of small) {
    const other = large.get(term);
    if (other) dot += val * other;
  }

  const cosine = dot / (normA * normB);
  if (!Number.isFinite(cosine)) return 0;
  return Math.max(0, Math.min(1, cosine));
};

const extractLikelySkillsFromJob = (jobText, maxSkills = 20) => {
  const text = String(jobText || '').toLowerCase();

  // Lightweight keyword extraction (no heavy NLP deps).
  const knownSkillPatterns = [
    /react|redux|next\.js/,
    /node(\.js)?|express/,
    /python|django|flask/,
    /java|spring/,
    /c\+\+|c#|typescript/,
    /sql|postgres|mysql/,
    /mongodb/,
    /aws|gcp|azure/,
    /docker|kubernetes|k8s/,
    /terraform/,
    /machine learning|ml\b/,
    /deep learning|dl\b/,
    /nlp|natural language processing/,
    /data analysis|analytics|bi\b|power bi|tableau/,
    /statistics/,
    /excel/,
    /communication|stakeholder/,
  ];

  const extracted = [];

  for (const re of knownSkillPatterns) {
    if (re.test(text)) {
      extracted.push(re.toString());
    }
  }

  // Fallback: pick top frequent meaningful tokens.
  const tokens = tokenize(jobText)
    .filter((t) => t.length >= 2)
    .slice(0, 4000);
  const freq = new Map();
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

  for (const [tok] of sorted) {
    if (extracted.length >= maxSkills) break;
    if (extracted.includes(tok)) continue;
    extracted.push(tok);
  }

  // Normalize: keep only human-ish tokens (remove regex strings like '/react|redux.../')
  const normalized = extracted
    .map((s) => {
      if (s.startsWith('/') && s.endsWith('/')) {
        return s.replace(/^\/|\/$/g, '');
      }
      return s;
    })
    .map((s) => s.replace(/\\b/g, '').replace(/\s*\|\s*/g, ','))
    .flatMap((s) => s.split(','))
    .map((s) => s.trim())
    .map((s) => s.replace(/\\\./g, '.').replace(/\\/g, ''))
    .filter(Boolean)
    .slice(0, maxSkills);

  // De-dupe (case-insensitive)
  const seen = new Set();
  const uniq = [];
  for (const s of normalized) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(s);
  }
  return uniq;
};

const skillsMatch = (requiredSkill, candidateSkill) => {
  const req = String(requiredSkill || '').toLowerCase().trim();
  const cand = String(candidateSkill || '').toLowerCase().trim();
  if (!req || !cand) return false;

  if (cand.includes(req) || req.includes(cand)) return true;

  const split = (s) =>
    s
      .split(/[^a-z0-9+#]+/gi)
      .map((x) => x.trim())
      .filter((x) => x.length > 1);

  const reqTokens = new Set(split(req));
  const candTokens = new Set(split(cand));
  if (!reqTokens.size || !candTokens.size) return false;

  let overlap = 0;
  for (const t of reqTokens) if (candTokens.has(t)) overlap++;
  const jaccard = overlap / (reqTokens.size + candTokens.size - overlap);

  return jaccard >= 0.25;
};

const buildResumeTextForScoring = (parsed) => {
  const parts = [];
  parts.push(parsed?.name || '');

  if (parsed?.contact?.email) parts.push(String(parsed.contact.email));
  if (parsed?.contact?.phone) parts.push(String(parsed.contact.phone));
  if (parsed?.contact?.linkedin) parts.push(String(parsed.contact.linkedin));
  if (parsed?.contact?.github) parts.push(String(parsed.contact.github));

  if (Array.isArray(parsed?.skills)) parts.push(parsed.skills.join(' '));

  if (Array.isArray(parsed?.education)) {
    parts.push(
      parsed.education
        .map((e) => `${e.degree || ''} ${e.institution || ''} ${e.years || ''}`.trim())
        .join(' ')
    );
  }

  if (Array.isArray(parsed?.experience)) {
    parts.push(
      parsed.experience
        .map((x) => {
          const resp = Array.isArray(x.responsibilities) ? x.responsibilities.join(' ') : '';
          return `${x.role || ''} ${x.company || ''} ${x.duration || ''} ${x.location || ''} ${resp}`.trim();
        })
        .join(' ')
    );
  }

  if (Array.isArray(parsed?.projects)) {
    parts.push(
      parsed.projects
        .map((p) => `${p.name || ''} ${p.description || ''} ${p.role || ''} ${p.technologies || ''}`.trim())
        .join(' ')
    );
  }

  return parts.filter(Boolean).join('\n');
};

const callGeminiForNarrativeSummary = async ({ parsed, position, description, skillGap }) => {
  if (!process.env.GEMINI_API_KEY) return null;

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const candidate = {
    name: parsed?.name || null,
    contact: parsed?.contact || null,
    education: parsed?.education || [],
    experience: parsed?.experience || [],
    skills: parsed?.skills || [],
  };

  const job = {
    position: position || '',
    description: description || '',
  };

  const prompt = `Write an AI narrative summary (plain English, 1 paragraph) for a recruiter about the candidate.
Candidate:
${JSON.stringify(candidate).slice(0, 3500)}

Job Context:
${JSON.stringify(job).slice(0, 1500)}

Skill gap analysis:
${JSON.stringify(skillGap).slice(0, 1200)}

Requirements:
- Mention the candidate's strongest matching skills (based on the gap analysis).
- Mention missing skills the recruiter should evaluate.
- Keep it concise and recruiter-friendly.
- Do NOT output bullet points.`;

  try {
    const response = await axios.post(
      url,
      {
        systemInstruction: { parts: [{ text: 'You are a helpful recruiting assistant for a web app called Velocity.' }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 220,
          temperature: 0.5,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000,
      }
    );

    return (
      response?.data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text)
        .filter(Boolean)
        .join('') || null
    );
  } catch (e) {
    // Narrative summary is optional; do not fail parsing if Gemini fails.
    return null;
  }
};

const buildResumeInsights = async ({ parsed, position, description }) => {
  const skills = Array.isArray(parsed?.skills) ? parsed.skills : [];
  const resumeText = buildResumeTextForScoring(parsed);
  const jobText = [position || '', description || ''].join('\n').trim();

  const requiredSkills = extractLikelySkillsFromJob(jobText);

  const presentSkills = [];
  const missingSkills = [];

  for (const req of requiredSkills) {
    const isPresent = skills.some((cand) => skillsMatch(req, cand));
    if (isPresent) presentSkills.push(req);
    else missingSkills.push(req);
  }

  const cosine = computeTfIdfCosineSimilarity(jobText, resumeText);
  const jobMatchScorePercent = Math.round(cosine * 100);

  const profileCard = {
    name: parsed?.name || null,
    contact: parsed?.contact || null,
    topSkills: skills.slice(0, 12),
    education: Array.isArray(parsed?.education) ? parsed.education : [],
    experience: Array.isArray(parsed?.experience) ? parsed.experience : [],
  };

  const skillGap = {
    requiredSkills,
    presentSkills,
    missingSkills,
  };

  const narrativeSummary = await callGeminiForNarrativeSummary({
    parsed,
    position,
    description,
    skillGap,
  });

  return {
    profileCard,
    jobMatchScore: {
      score: jobMatchScorePercent,
      label: jobMatchScorePercent >= 75 ? 'Strong match' : jobMatchScorePercent >= 45 ? 'Moderate match' : 'Potential match',
    },
    skillGapAnalysis: skillGap,
    aiNarrativeSummary: narrativeSummary,
  };
};

module.exports = { parseResumePy };

