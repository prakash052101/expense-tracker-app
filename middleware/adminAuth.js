/**
 * Admin authorization middleware
 * Checks if authenticated user has admin privileges
 * Must be used after authenticate middleware
 */
const requireAdmin = (req, res, next) => {
  try {
    // Check if user is attached to request (should be done by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      });
    }

    // Check if user has admin flag
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Admin access required',
          code: 'FORBIDDEN'
        }
      });
    }

    // User is admin, proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Authorization check failed',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

module.exports = {
  requireAdmin
};
