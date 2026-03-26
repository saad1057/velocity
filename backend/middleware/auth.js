const { verifyToken } = require('../utils/jwt');
const User = require('../model/user');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Please provide a valid token.' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found. Token is invalid.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired. Please login again.' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error', 
      error: error.message 
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

module.exports = {
  authenticate,
  adminOnly,
};

