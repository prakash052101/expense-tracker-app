import api from './api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

/**
 * Get admin dashboard data
 * Includes total users, premium users, revenue, and user growth
 * @returns {Promise} Response with admin dashboard data
 */
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

/**
 * Get list of all users
 * @param {Object} params - Query parameters (page, limit, search)
 * @returns {Promise} Response with user list
 */
export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

/**
 * Get revenue statistics
 * @param {Object} params - Query parameters (startDate, endDate)
 * @returns {Promise} Response with revenue data
 */
export const getRevenueStats = async (params = {}) => {
  const response = await api.get('/admin/revenue', { params });
  return response.data;
};

export default {
  getAdminDashboard,
  getUsers,
  getRevenueStats,
};
