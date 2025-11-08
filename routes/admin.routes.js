const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

// Controllers
const {
  getDashboard,
  getUsers,
  getRevenue
} = require('../controller/admin.controller');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard with system-wide analytics
 * @access  Private (Admin only)
 * @returns {Object} Admin dashboard data including:
 *          - userStats: { totalUsers, premiumUsers, freeUsers, premiumPercentage }
 *          - revenue: { total, currency }
 *          - userGrowth: Array of daily user registrations for last 30 days
 *          - recentPurchases: Last 10 successful premium purchases
 */
router.get(
  '/dashboard',
  authenticate,
  requireAdmin,
  getDashboard
);

/**
 * @route   GET /api/admin/users
 * @desc    Get list of all users with pagination and filtering
 * @access  Private (Admin only)
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 20)
 * @query   premium - Filter by premium status: true/false (optional)
 * @returns {Object} User list with pagination info:
 *          - users: Array of user objects (password excluded)
 *          - pagination: { currentPage, totalPages, totalCount, limit, hasNextPage, hasPrevPage }
 */
router.get(
  '/users',
  authenticate,
  requireAdmin,
  getUsers
);

/**
 * @route   GET /api/admin/revenue
 * @desc    Get detailed revenue statistics
 * @access  Private (Admin only)
 * @query   startDate - Start date for filtering (ISO 8601 format, optional)
 * @query   endDate - End date for filtering (ISO 8601 format, optional)
 * @returns {Object} Revenue statistics including:
 *          - total: { amount, count, average, currency }
 *          - monthlyBreakdown: Array of monthly revenue data (last 12 months)
 *          - byStatus: Revenue breakdown by order status (success, pending, failed)
 */
router.get(
  '/revenue',
  authenticate,
  requireAdmin,
  getRevenue
);

module.exports = router;
