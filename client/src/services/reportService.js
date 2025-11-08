import api from './api';

/**
 * Report Service
 * Handles all report and analytics-related API calls
 */

/**
 * Get dashboard analytics data
 * Includes KPIs, recent expenses, and category distribution
 * @param {Object} filters - Optional filters (startDate, endDate, category)
 * @returns {Promise} Response with dashboard data
 */
export const getDashboardData = async (filters = {}) => {
  const params = {
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.category && { category: filters.category }),
  };

  const response = await api.get('/reports/dashboard', { params });
  return response.data;
};

/**
 * Get monthly summary report
 * @param {String} month - Month in YYYY-MM format
 * @returns {Promise} Response with monthly summary
 */
export const getMonthlyReport = async (month) => {
  const params = month ? { month } : {};
  const response = await api.get('/reports/monthly', { params });
  return response.data;
};

/**
 * Export expenses to CSV
 * @param {Object} filters - Filter options (startDate, endDate, category)
 * @returns {Promise} Blob data for CSV file
 */
export const exportToCSV = async (filters = {}) => {
  const params = {
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.category && { category: filters.category }),
  };

  const response = await api.get('/reports/export', {
    params,
    responseType: 'blob',
  });
  
  return response.data;
};

/**
 * Trigger CSV download in browser
 * @param {Object} filters - Filter options for export
 * @param {String} filename - Optional custom filename
 */
export const downloadCSV = async (filters = {}, filename = null) => {
  try {
    const blob = await exportToCSV(filters);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date if not provided
    const date = new Date().toISOString().split('T')[0];
    link.download = filename || `expenses_${date}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('CSV download failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  getDashboardData,
  getMonthlyReport,
  exportToCSV,
  downloadCSV,
};
