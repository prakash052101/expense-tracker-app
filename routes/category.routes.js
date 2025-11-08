const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middleware/auth');

// Controllers
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controller/category.controller');

/**
 * @route   GET /api/categories
 * @desc    Get all categories for authenticated user with expense counts
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  getCategories
);

/**
 * @route   POST /api/categories
 * @desc    Create new category with uniqueness validation
 * @access  Private
 * @body    name - Category name (required, 1-50 chars)
 * @body    color - Hex color code (optional, e.g., #3B82F6)
 * @body    icon - Icon name/emoji (optional)
 */
router.post(
  '/',
  authenticate,
  createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update existing category
 * @access  Private
 * @param   id - Category ID
 * @body    name - Category name (optional, 1-50 chars)
 * @body    color - Hex color code (optional, e.g., #3B82F6)
 * @body    icon - Icon name/emoji (optional)
 */
router.put(
  '/:id',
  authenticate,
  updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category and set associated expenses to uncategorized
 * @access  Private
 * @param   id - Category ID
 */
router.delete(
  '/:id',
  authenticate,
  deleteCategory
);

module.exports = router;
