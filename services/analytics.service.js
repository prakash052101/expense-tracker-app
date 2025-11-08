const Expense = require('../models/expense.model');
const mongoose = require('mongoose');

/**
 * Calculate monthly totals for current month, previous month, and year-to-date
 * @param {String} userId - User ID
 * @returns {Object} - { currentMonth, previousMonth, yearToDate }
 */
async function calculateMonthlyTotals(userId) {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [currentMonth, previousMonth, yearToDate] = await Promise.all([
    // Current month total
    Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: currentMonthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]),
    // Previous month total
    Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: previousMonthStart, $lte: previousMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]),
    // Year-to-date total
    Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: yearStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ])
  ]);

  return {
    currentMonth: currentMonth[0]?.total || 0,
    previousMonth: previousMonth[0]?.total || 0,
    yearToDate: yearToDate[0]?.total || 0
  };
}

/**
 * Calculate expense distribution by category
 * @param {String} userId - User ID
 * @param {Date} startDate - Start date for filtering (optional)
 * @param {Date} endDate - End date for filtering (optional)
 * @returns {Array} - Array of { categoryId, categoryName, total, count, percentage }
 */
async function calculateCategoryDistribution(userId, startDate = null, endDate = null) {
  const matchStage = {
    userId: new mongoose.Types.ObjectId(userId)
  };

  // Add date filters if provided
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = startDate;
    if (endDate) matchStage.date.$lte = endDate;
  }

  const distribution = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    {
      $unwind: {
        path: '$categoryInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        categoryId: '$_id',
        categoryName: { $ifNull: ['$categoryInfo.name', 'Uncategorized'] },
        categoryColor: { $ifNull: ['$categoryInfo.color', '#6B7280'] },
        total: 1,
        count: 1
      }
    },
    { $sort: { total: -1 } }
  ]);

  // Calculate total for percentage
  const grandTotal = distribution.reduce((sum, item) => sum + item.total, 0);

  // Add percentage to each category
  return distribution.map(item => ({
    ...item,
    percentage: grandTotal > 0 ? ((item.total / grandTotal) * 100).toFixed(2) : 0
  }));
}

/**
 * Calculate budget tracking information
 * @param {String} userId - User ID
 * @param {Number} monthlyBudget - User's monthly budget
 * @returns {Object} - { budget, spent, remaining, percentageUsed, daysInMonth, daysRemaining }
 */
async function calculateBudgetTracking(userId, monthlyBudget) {
  if (!monthlyBudget || monthlyBudget <= 0) {
    return null;
  }

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysInMonth = Math.ceil((nextMonthStart - currentMonthStart) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((nextMonthStart - now) / (1000 * 60 * 60 * 24));

  const result = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: currentMonthStart }
      }
    },
    {
      $group: {
        _id: null,
        spent: { $sum: '$amount' }
      }
    }
  ]);

  const spent = result[0]?.spent || 0;
  const remaining = monthlyBudget - spent;
  const percentageUsed = ((spent / monthlyBudget) * 100).toFixed(2);

  return {
    budget: monthlyBudget,
    spent,
    remaining,
    percentageUsed: parseFloat(percentageUsed),
    daysInMonth,
    daysRemaining,
    isOverBudget: spent > monthlyBudget
  };
}

/**
 * Get recent expenses
 * @param {String} userId - User ID
 * @param {Number} limit - Number of expenses to return (default: 7)
 * @returns {Array} - Array of recent expenses with category info
 */
async function getRecentExpenses(userId, limit = 7) {
  return await Expense.find({ userId })
    .sort({ date: -1 })
    .limit(limit)
    .populate('category', 'name color icon')
    .lean();
}

/**
 * Get monthly summary for a specific month
 * @param {String} userId - User ID
 * @param {Number} year - Year
 * @param {Number} month - Month (0-11)
 * @returns {Object} - Monthly summary with totals and category breakdown
 */
async function getMonthlySummary(userId, year, month) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const [totals, categoryBreakdown] = await Promise.all([
    Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]),
    calculateCategoryDistribution(userId, monthStart, monthEnd)
  ]);

  return {
    year,
    month,
    monthName: monthStart.toLocaleString('default', { month: 'long' }),
    total: totals[0]?.total || 0,
    count: totals[0]?.count || 0,
    categoryBreakdown
  };
}

module.exports = {
  calculateMonthlyTotals,
  calculateCategoryDistribution,
  calculateBudgetTracking,
  getRecentExpenses,
  getMonthlySummary
};
