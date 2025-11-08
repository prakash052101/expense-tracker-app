import api from './api';

/**
 * Export Service
 * Handles CSV export and file download functionality
 */

/**
 * Export expenses to CSV format
 * @param {Object} filters - Filter options (startDate, endDate, category)
 * @returns {Promise<Blob>} Blob data for CSV file
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
 * Creates a temporary download link and triggers the download
 * @param {Blob} blob - CSV blob data
 * @param {String} filename - Optional custom filename
 */
export const triggerDownload = (blob, filename = null) => {
  try {
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
    console.error('File download failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Download expenses as CSV with applied filters
 * Combines export and download in a single function
 * @param {Object} filters - Filter options for export
 * @param {String} filename - Optional custom filename
 * @returns {Promise<Object>} Result object with success status
 */
export const downloadExpensesCSV = async (filters = {}, filename = null) => {
  try {
    const blob = await exportToCSV(filters);
    return triggerDownload(blob, filename);
  } catch (error) {
    console.error('CSV download failed:', error);
    return { 
      success: false, 
      error: error.response?.data?.error?.message || error.message || 'Failed to download CSV'
    };
  }
};

export default {
  exportToCSV,
  triggerDownload,
  downloadExpensesCSV,
};
