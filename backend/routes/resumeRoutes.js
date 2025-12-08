const express = require('express');
const { parseResumePy } = require('../controllers/resumeController');

const router = express.Router();

// Accepts JSON body with { documentBase64, fileName? }
router.post('/parse', express.json({ limit: '25mb' }), parseResumePy);

module.exports = router;

