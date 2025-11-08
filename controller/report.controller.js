const analyticsService = require('../services/analytics.service');
const csvService = require('../services/csv.service');

/**
 * GET /api/reports/dashboard
 * Get dashboard KPI data including monthly totals, category distribution, budget tracking, and recent expenses
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const monthlyBudget = req.user.preferences?.monthlyBudget;

    // Get all dashboard data in parallel
    const [monthlyTotals, categoryDistribution, budgetTracking, recentExpenses] = await Promise.all([
      analyticsService.calculateMonthlyTotals(userId),
      analyticsService.calculateCategoryDistribution(userId),
      monthlyBudget ? analyticsService.calculateBudgetTracking(userId, monthlyBudget) : Promise.resolve(null),
      analyticsService.getRecentExpenses(userId, 7)
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          currentMonth: { total: monthlyTotals.currentMonth },
          previousMonth: { total: monthlyTotals.previousMonth },
          yearToDate: { total: monthlyTotals.yearToDate }
        },
        categoryDistribution,
        budgetTracking,
        recentExpenses
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch dashboard data',
        code: 'DASHBOARD_ERROR'
      }
    });
  }
};

/**
 * GET /api/reports/monthly
 * Get monthly summaries for current month, previous month, and year-to-date
 * Query params: year (optional), month (optional) - for specific month summary
 */
exports.getMonthly = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // If specific year and month provided, return that month's summary
    if (req.query.year && req.query.month !== undefined) {
      const year = parseInt(req.query.year);
      const month = parseInt(req.query.month);

      if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid year or month parameter',
            code: 'INVALID_PARAMS'
          }
        });
      }

      const summary = await analyticsService.getMonthlySummary(userId, year, month);

      // Get top expenses for the month
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
      const topExpenses = await analyticsService.getRecentExpenses(userId, 10, monthStart, monthEnd);

      return res.status(200).json({
        success: true,
        data: {
          month: {
            year: summary.year,
            month: summary.month,
            monthName: summary.monthName,
            total: summary.total,
            count: summary.count
          },
          categoryBreakdown: summary.categoryBreakdown,
          topExpenses
        }
      });
    }

    // Otherwise, return current month, previous month, and YTD summaries
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const [current, previous] = await Promise.all([
      analyticsService.getMonthlySummary(userId, currentYear, currentMonth),
      analyticsService.getMonthlySummary(userId, previousYear, previousMonth)
    ]);

    // Calculate year-to-date summary
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date();
    const ytdCategoryBreakdown = await analyticsService.calculateCategoryDistribution(
      userId,
      yearStart,
      yearEnd
    );

    const monthlyTotals = await analyticsService.calculateMonthlyTotals(userId);

    res.status(200).json({
      success: true,
      data: {
        currentMonth: current,
        previousMonth: previous,
        yearToDate: {
          year: currentYear,
          total: monthlyTotals.yearToDate,
          categoryBreakdown: ytdCategoryBreakdown
        }
      }
    });
  } catch (error) {
    console.error('Error fetching monthly reports:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch monthly reports',
        code: 'MONTHLY_REPORT_ERROR'
      }
    });
  }
};

/**
 * GET /api/reports/export
 * Export expenses to CSV format with optional filters
 * Query params: startDate (optional), endDate (optional), categories (optional - comma-separated IDs)
 */
exports.exportCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, categories } = req.query;

    // Parse filters
    const filters = {};
    
    if (startDate) {
      filters.startDate = new Date(startDate);
      if (isNaN(filters.startDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid startDate format',
            code: 'INVALID_DATE'
          }
        });
      }
    }

    if (endDate) {
      filters.endDate = new Date(endDate);
      if (isNaN(filters.endDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid endDate format',
            code: 'INVALID_DATE'
          }
        });
      }
    }

    if (categories) {
      // Parse comma-separated category IDs
      filters.categories = categories.split(',').map(id => id.trim()).filter(id => id);
    }

    // Generate CSV
    const { csv, filename } = await csvService.generateExpenseCSV(userId, filters);

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');

    // Send CSV content
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to export expenses',
        code: 'EXPORT_ERROR'
      }
    });
  }
};

module.exports = exports;
