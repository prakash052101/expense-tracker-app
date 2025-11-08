import api from './api';

/**
 * Authentication service for handling user auth operations
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} Response with token and user data
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Response with token and user data
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  /**
   * Request password reset
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Response indicating success or failure
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message || 'Password reset email sent',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send reset email',
      };
    }
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token from email
   * @param {string} resetData.password - New password
   * @returns {Promise<Object>} Response indicating success or failure
   */
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return {
        success: true,
        message: response.data.message || 'Password reset successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }
  },

  /**
   * Verify JWT token
   * @returns {Promise<Object>} Response with user data if token is valid
   */
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Token verification failed',
      };
    }
  },
};

export default authService;
