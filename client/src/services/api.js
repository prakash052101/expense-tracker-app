import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (status === 403) {
        console.error('Access denied:', data.error?.message || 'Insufficient permissions');
      }

      // Handle 429 Too Many Requests - Rate limit exceeded
      if (status === 429) {
        console.error('Rate limit exceeded. Please try again later.');
      }

      // Return formatted error
      return Promise.reject({
        message: data.error?.message || 'An error occurred',
        code: data.error?.code || 'UNKNOWN_ERROR',
        status,
        details: data.error?.details,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: 0,
      });
    }
  }
);

export default api;
