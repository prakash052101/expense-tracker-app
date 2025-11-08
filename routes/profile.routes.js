const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile.controller');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * Validation middleware for profile update
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for password change
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for preferences update
 */
const validatePreferencesUpdate = [
  body('currency')
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code (e.g., USD, EUR)'),
  body('timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a valid string'),
  body('monthlyBudget')
    .optional()
    .custom((value) => {
      if (value === null) return true;
      if (typeof value === 'number' && value >= 0) return true;
      throw new Error('Monthly budget must be a positive number or null');
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/', authenticate, profileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile (name, email)
 * @access  Private
 */
router.put('/', authenticate, validateProfileUpdate, profileController.updateProfile);

/**
 * @route   PUT /api/profile/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authenticate, validatePasswordChange, profileController.changePassword);

/**
 * @route   PUT /api/profile/preferences
 * @desc    Update user preferences (currency, timezone, monthlyBudget)
 * @access  Private
 */
router.put('/preferences', authenticate, validatePreferencesUpdate, profileController.updatePreferences);

module.exports = router;
