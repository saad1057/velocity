require('dotenv').config();
const axios = require('axios');

/**
 * Proxy to Python pyresparser microservice (ai-service/app.py).
 * Expects JSON body: { documentBase64, fileName? }
 */
const parseResumePy = async (req, res) => {
  try {
    const { documentBase64, fileName } = req.body || {};

    if (!documentBase64) {
      return res.status(400).json({
        success: false,
        message: 'documentBase64 is required (base64-encoded PDF/DOCX)',
      });
    }

    const baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    // Inform upstream that the parser is not configured
    const response = await axios.post(
      `${baseUrl}/parse`,
      { documentBase64, fileName },
      { timeout: 30000 }
    );

    return res.status(response.status || 200).json({
      success: response.data?.success ?? true,
      data: response.data?.data ?? response.data,
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

module.exports = { parseResumePy };

