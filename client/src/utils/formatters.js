/**
 * Utility functions for formatting dates, currency, and other data
 */

/**
 * Format currency amount
 * @param {Number} amount - Amount to format
 * @param {String} currency - Currency code (default: 'USD')
 * @param {Object} options - Additional formatting options
 * @returns {String} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    ...restOptions
  } = options;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
    ...restOptions,
  }).format(amount || 0);
};

/**
 * Format date to locale string
 * @param {Date|String} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {String} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format date to short format (MM/DD/YYYY)
 * @param {Date|String} date - Date to format
 * @returns {String} Formatted date string
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US');
};

/**
 * Format date to ISO string for input fields (YYYY-MM-DD)
 * @param {Date|String} date - Date to format
 * @returns {String} ISO date string
 */
export const formatDateISO = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Format month to readable string (e.g., "January 2024")
 * @param {String} monthStr - Month in YYYY-MM format
 * @returns {String} Formatted month string
 */
export const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month) - 1, 1);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

/**
 * Get current month in YYYY-MM format
 * @returns {String} Current month string
 */
export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Get previous month in YYYY-MM format
 * @param {String} monthStr - Optional month string (defaults to current month)
 * @returns {String} Previous month string
 */
export const getPreviousMonth = (monthStr = null) => {
  const current = monthStr ? new Date(monthStr + '-01') : new Date();
  const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  const year = previous.getFullYear();
  const month = String(previous.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Format percentage
 * @param {Number} value - Value to format as percentage
 * @param {Number} decimals - Number of decimal places (default: 1)
 * @returns {String} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with commas
 * @param {Number} value - Number to format
 * @returns {String} Formatted number string
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value || 0);
};

export default {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatDateISO,
  formatMonth,
  getCurrentMonth,
  getPreviousMonth,
  formatPercentage,
  formatNumber,
};
