const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const ForgotPassword = require('../models/forgotpassword.model');
const { createDefaultCategories } = require('../services/category.service');
const logger = require('../utils/logger');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Name, email, and password are required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Email already registered',
          code: 'EMAIL_EXISTS'
        }
      });
    }

    // Hash password with 10 rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      totalamount: 0,
      ispremiumuser: false,
      isAdmin: false
    });

    await newUser.save();

    // Create default categories for the new user
    await createDefaultCategories(newUser._id);

    // Log successful user registration
    logger.info('User registered successfully', {
      userId: newUser._id.toString(),
      email: newUser.email,
      timestamp: new Date().toISOString()
    });

    // Generate JWT token (24h expiry)
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        ispremiumuser: newUser.ispremiumuser,
        isAdmin: newUser.isAdmin
      },
      process.env.JWT_SECRET || 'yourkey',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          ispremiumuser: newUser.ispremiumuser,
          isAdmin: newUser.isAdmin
        },
        token
      }
    });
  } catch (error) {
    logger.error('Registration error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Registration failed',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email and password are required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'AUTH_FAILED'
        }
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'AUTH_FAILED'
        }
      });
    }

    // Generate JWT token (24h expiry)
    const token = jwt.sign(
      { 
        userId: user._id, 
        ispremiumuser: user.ispremiumuser,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET || 'yourkey',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          ispremiumuser: user.ispremiumuser,
          isAdmin: user.isAdmin
        },
        token
      }
    });
  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Login failed',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate unique reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Create password reset record
    const forgotPasswordRecord = new ForgotPassword({
      _id: resetToken,
      userId: user._id,
      active: true,
      expiresAt
    });

    await forgotPasswordRecord.save();

    // TODO: Send email with reset link
    // For now, we'll just return success
    // In production, integrate with email service (SendGrid, etc.)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    console.log(`Password reset link for ${email}: ${resetLink}`);

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetLink })
    });
  } catch (error) {
    logger.error('Forgot password error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process password reset request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate required fields
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Token and new password are required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Find reset token record
    const resetRecord = await ForgotPassword.findById(token);
    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    // Check if token is active
    if (!resetRecord.active) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Reset token has already been used',
          code: 'TOKEN_USED'
        }
      });
    }

    // Check if token has expired (if expiresAt field exists)
    if (resetRecord.expiresAt && new Date() > resetRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Reset token has expired',
          code: 'TOKEN_EXPIRED'
        }
      });
    }

    // Find user
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Hash new password with 10 rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Invalidate reset token
    resetRecord.active = false;
    await resetRecord.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    logger.error('Reset password error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to reset password',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Verify JWT token
 * GET /api/auth/verify
 */
const verify = async (req, res) => {
  try {
    // Token is already verified by auth middleware
    // req.user is populated by middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          ispremiumuser: req.user.ispremiumuser,
          isAdmin: req.user.isAdmin,
          preferences: req.user.preferences
        }
      }
    });
  } catch (error) {
    logger.error('Verify token error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Token verification failed',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verify
};
