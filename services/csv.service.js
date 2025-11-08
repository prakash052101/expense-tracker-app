const Expense = require('../models/expense.model');
const mongoose = require('mongoose');

/**
 * Generate CSV content from expenses
 * @param {String} userId - User ID
 * @param {Object} filters - Filter options
 * @param {Date} filters.startDate - Start date for filtering (optional)
 * @param {Date} filters.endDate - End date for filtering (optional)
 * @param {Array} filters.categories - Array of category IDs to filter (optional)
 * @returns {Object} - { csv: String, filename: String }
 */
async function generateExpenseCSV(userId, filters = {}) {
  const { startDate, endDate, categories } = filters;

  // Build query
  const query = {
    userId: new mongoose.Types.ObjectId(userId)
  };

  // Add date filters
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Add category filter
  if (categories && categories.length > 0) {
    query.category = { 
      $in: categories.map(id => new mongoose.Types.ObjectId(id)) 
    };
  }

  // Fetch expenses with category information
  const expenses = await Expense.find(query)
    .populate('category', 'name')
    .sort({ date: -1 })
    .lean();

  // Generate CSV content
  const csv = convertToCSV(expenses);

  // Generate filename with current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `expenses_${currentDate}.csv`;

  return { csv, filename };
}

/**
 * Convert expenses array to CSV format
 * @param {Array} expenses - Array of expense objects
 * @returns {String} - CSV formatted string
 */
function convertToCSV(expenses) {
  // Define CSV headers
  const headers = ['Date', 'Description', 'Amount', 'Category', 'Receipt URL'];
  
  // Create CSV rows
  const rows = expenses.map(expense => {
    const date = new Date(expense.date).toISOString().split('T')[0]; // YYYY-MM-DD format
    const description = escapeCSVField(expense.description);
    const amount = expense.amount.toFixed(2);
    const category = escapeCSVField(expense.category?.name || 'Uncategorized');
    const receiptUrl = expense.receiptUrl || '';

    return [date, description, amount, category, receiptUrl].join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Escape CSV field to handle special characters
 * @param {String} field - Field value to escape
 * @returns {String} - Escaped field value
 */
function escapeCSVField(field) {
  if (!field) return '';
  
  // Convert to string
  const str = String(field);
  
  // If field contains comma, newline, or double quote, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

module.exports = {
  generateExpenseCSV
};
