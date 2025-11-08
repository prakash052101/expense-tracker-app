const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middleware/auth');

// Controllers
const {
  getDashboard,
  getMonthly,
  exportCSV
} = require('../controller/report.controller');

/**
 * @route   GET /api/reports/dashboard
 * @desc    Get dashboard analytics with KPI data
 * @access  Private
 * @returns {Object} Dashboard data including:
 *          - kpis: { currentMonth, previousMonth, yearToDate }
 *          - categoryDistribution: Array of category totals with percentages
 *          - budgetTracking: Budget status (if monthly budget is set)
 *          - recentExpenses: Last 7 expenses with category info
 */
router.get(
  '/dashboard',
  authenticate,
  getDashboard
);

/**
 * @route   GET /api/reports/monthly
 * @desc    Get monthly summaries for current month, previous month, and year-to-date
 * @access  Private
 * @query   year - Specific year for monthly summary (optional)
 * @query   month - Specific month (0-11) for monthly summary (optional)
 * @returns {Object} Monthly summary data including:
 *          - currentMonth: Current month totals and category breakdown
 *          - previousMonth: Previous month totals and category breakdown
 *          - yearToDate: YTD totals and category breakdown
 *          OR single month summary if year and month params provided
 */
router.get(
  '/monthly',
  authenticate,
  getMonthly
);

/**
 * @route   GET /api/reports/export
 * @desc    Export expenses to CSV format with optional filters
 * @access  Private
 * @query   startDate - Start date for filtering (ISO 8601 format, optional)
 * @query   endDate - End date for filtering (ISO 8601 format, optional)
 * @query   categories - Comma-separated category IDs to filter (optional)
 * @returns {File} CSV file download with filename format: expenses_YYYY-MM-DD.csv
 */
router.get(
  '/export',
  authenticate,
  exportCSV
);

module.exports = router;
