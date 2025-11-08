const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middleware/auth');
const { handleUploadError } = require('../middleware/fileUpload');
const {
  validateCreateExpense,
  validateUpdateExpense,
  validateExpenseId,
  validateExpenseQuery
} = require('../middleware/expenseValidator');

// Controllers
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controller/expense.controller');

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for authenticated user with pagination and filtering
 * @access  Private
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 20, max: 100)
 * @query   startDate - Filter expenses from this date (ISO 8601)
 * @query   endDate - Filter expenses until this date (ISO 8601)
 * @query   category - Filter by category ID
 */
router.get(
  '/',
  authenticate,
  validateExpenseQuery,
  getExpenses
);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get single expense by ID
 * @access  Private
 * @param   id - Expense ID
 */
router.get(
  '/:id',
  authenticate,
  validateExpenseId,
  getExpenseById
);

/**
 * @route   POST /api/expenses
 * @desc    Create new expense with optional file upload
 * @access  Private
 * @body    amount - Expense amount (required, positive number)
 * @body    description - Expense description (required, 1-200 chars)
 * @body    date - Expense date (required, ISO 8601)
 * @body    category - Category ID (optional, MongoDB ObjectId)
 * @file    receipt - Receipt file (optional, max 5MB, images/PDF only)
 */
router.post(
  '/',
  authenticate,
  handleUploadError,
  validateCreateExpense,
  createExpense
);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update existing expense
 * @access  Private
 * @param   id - Expense ID
 * @body    amount - Expense amount (optional, positive number)
 * @body    description - Expense description (optional, 1-200 chars)
 * @body    date - Expense date (optional, ISO 8601)
 * @body    category - Category ID (optional, MongoDB ObjectId)
 * @file    receipt - Receipt file (optional, max 5MB, images/PDF only)
 */
router.put(
  '/:id',
  authenticate,
  handleUploadError,
  validateUpdateExpense,
  updateExpense
);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense with Firebase file cleanup
 * @access  Private
 * @param   id - Expense ID
 */
router.delete(
  '/:id',
  authenticate,
  validateExpenseId,
  deleteExpense
);

module.exports = router;
