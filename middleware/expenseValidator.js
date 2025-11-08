const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware for creating expenses
 */
const validateCreateExpense = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)'),
  
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format'),
  
  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for updating expenses
 */
const validateUpdateExpense = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID format'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)'),
  
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format'),
  
  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for expense ID parameter
 */
const validateExpenseId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID format'),
  
  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for expense query parameters
 */
const validateExpenseQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format. Use ISO 8601 format (YYYY-MM-DD)'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format. Use ISO 8601 format (YYYY-MM-DD)'),
  
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format'),
  
  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        }
      });
    }
    next();
  }
];

module.exports = {
  validateCreateExpense,
  validateUpdateExpense,
  validateExpenseId,
  validateExpenseQuery
};
