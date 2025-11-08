import api from './api';

/**
 * Profile Service
 * Handles all profile-related API calls
 */

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

/**
 * Update user profile (name, email)
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.name - User's name
 * @param {string} profileData.email - User's email
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (passwordData) => {
  const response = await api.put('/profile/password', passwordData);
  return response.data;
};

/**
 * Update user preferences
 * @param {Object} preferences - User preferences
 * @param {string} preferences.currency - Currency code (e.g., USD, EUR)
 * @param {string} preferences.timezone - Timezone string
 * @param {number|null} preferences.monthlyBudget - Monthly budget amount
 * @returns {Promise<Object>} Updated preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await api.put('/profile/preferences', preferences);
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
  updatePreferences,
};
