const Activity = require("../model/activity");

/**
 * Log a user activity to the database manually
 * @param {Object} params - Activity parameters
 * @param {string} params.userId - User ID performing the action
 * @param {string} params.feature - The feature area (e.g., 'auth', 'recruiter-management')
 * @param {string} params.action - The specific action (e.g., 'password-reset', 'deleted-user')
 * @param {Object} [params.metadata] - Optional additional data
 * @param {string} [params.ip] - Optional IP address
 * @param {string} [params.userAgent] - Optional browser user agent
 */
const logActivity = async ({ userId, feature, action, metadata = {}, ip, userAgent }) => {
  try {
    // Basic sanitization of metadata
    const sanitizedMetadata = metadata ? JSON.parse(JSON.stringify(metadata)) : {};
    
    // Create activity record
    await Activity.create({
      userId,
      feature,
      action,
      metadata: sanitizedMetadata,
      ip,
      userAgent,
    });
  } catch (error) {
    console.error("Activity logging error:", error);
    // We don't throw here to ensure core business logic doesn't fail due to logging issues
  }
};

module.exports = { logActivity };
