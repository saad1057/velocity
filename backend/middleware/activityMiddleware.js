const { logActivity } = require("../utils/activityLogger");

/**
 * Middleware for automatic activity tracking
 * Filters routes and methods to create meaningful behavior logs
 */
const trackActivity = async (req, res, next) => {
  // We hook into the finish event of the response to ensure success or capture status
  res.on('finish', () => {
    // Basic skip rules (from prompt)
    const skipRoutes = ['/auth', '/static', '/assets', '/favicon.ico'];
    if (skipRoutes.some(route => req.originalUrl.includes(route))) return;
    
    // Only track authenticated requests with a user object
    if (!req.user || !req.user._id) return;
    
    // Map HTTP methods to logical actions
    const methodActions = {
      'GET': 'READ',
      'POST': 'CREATE',
      'PUT': 'UPDATE',
      'PATCH': 'UPDATE',
      'DELETE': 'DELETE'
    };
    const action = methodActions[req.method] || req.method;
    
    // Derive feature from the first segment of the route
    const urlParts = req.originalUrl.split('?')[0].split('/');
    // e.g. /api/recruitment/jobs -> recruitment
    // e.g. /admin/users -> admin
    const feature = urlParts[2] || urlParts[1] || 'root';
    
    // Perform async logging without blocking the response
    logActivity({
      userId: req.user._id,
      feature: feature.toLowerCase(),
      action: `${action}_${req.method}`,
      metadata: {
        path: req.originalUrl,
        statusCode: res.statusCode,
        method: req.method,
        // We avoid logging large request bodies for security and performance
        params: req.params,
        query: req.query,
      },
      ip: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent']
    });
  });

  next();
};

module.exports = { trackActivity };
