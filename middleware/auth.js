const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/**
 * Authentication middleware
 * Verifies JWT token and loads user from database
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No authorization token provided',
          code: 'NO_TOKEN'
        }
      });
    }

    // Extract token (handle "Bearer <token>" format)
    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Verify JWT token using JWT_SECRET from environment
    const jwtSecret = process.env.JWT_SECRET || 'yourkey';
    const decoded = jwt.verify(token, jwtSecret);

    // Load user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        }
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    // Generic authentication error
    console.error('Authentication error:', err);
    res.status(401).json({
      success: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      }
    });
  }
};

module.exports = {
  authenticate,
};
