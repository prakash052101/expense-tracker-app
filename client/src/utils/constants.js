/**
 * Application constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Authentication
export const TOKEN_KEY = 'expense_tracker_token';
export const USER_KEY = 'expense_tracker_user';
export const TOKEN_EXPIRY_HOURS = 24;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const EXPENSES_PER_PAGE = 20;
export const CATEGORIES_PER_PAGE = 50;

// File Upload
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

// Currency Options
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'INR', label: 'INR - Indian Rupee', symbol: '₹' },
  { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
  { value: 'CNY', label: 'CNY - Chinese Yuan', symbol: '¥' },
];

// Timezone Options (Common timezones)
export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'America/New_York', label: 'EST - Eastern Time' },
  { value: 'America/Chicago', label: 'CST - Central Time' },
  { value: 'America/Denver', label: 'MST - Mountain Time' },
  { value: 'America/Los_Angeles', label: 'PST - Pacific Time' },
  { value: 'Europe/London', label: 'GMT - London' },
  { value: 'Europe/Paris', label: 'CET - Central European Time' },
  { value: 'Asia/Dubai', label: 'GST - Gulf Standard Time' },
  { value: 'Asia/Kolkata', label: 'IST - India Standard Time' },
  { value: 'Asia/Shanghai', label: 'CST - China Standard Time' },
  { value: 'Asia/Tokyo', label: 'JST - Japan Standard Time' },
  { value: 'Australia/Sydney', label: 'AEDT - Australian Eastern Time' },
];

// Default Categories (for reference)
export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#EF4444' },
  { name: 'Transportation', icon: '🚗', color: '#3B82F6' },
  { name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
  { name: 'Entertainment', icon: '🎬', color: '#EC4899' },
  { name: 'Bills & Utilities', icon: '💡', color: '#F59E0B' },
  { name: 'Healthcare', icon: '🏥', color: '#10B981' },
  { name: 'Education', icon: '📚', color: '#6366F1' },
  { name: 'Travel', icon: '✈️', color: '#14B8A6' },
  { name: 'Other', icon: '📌', color: '#6B7280' },
];

// Category Colors
export const CATEGORY_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Orange
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#F97316', // Orange
  '#84CC16', // Lime
];

// Date Ranges
export const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

// Chart Colors
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
];

// Premium Features
export const PREMIUM_PRICE = 499; // In INR
export const PREMIUM_CURRENCY = 'INR';
export const PREMIUM_FEATURES = [
  'Unlimited expense tracking',
  'Advanced analytics and reports',
  'Priority customer support',
  'Export to multiple formats',
  'Custom categories and tags',
  'Budget tracking and alerts',
  'Leaderboard access',
];

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 1,
  DESCRIPTION_MAX_LENGTH: 200,
  CATEGORY_NAME_MIN_LENGTH: 1,
  CATEGORY_NAME_MAX_LENGTH: 50,
};

// Toast/Notification Duration
export const TOAST_DURATION = 3000; // 3 seconds
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Debounce Delays
export const DEBOUNCE_DELAY = 300; // 300ms for search inputs
export const DEBOUNCE_DELAY_LONG = 500; // 500ms for expensive operations

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  REPORTS: '/reports',
  PROFILE: '/profile',
  PREMIUM: '/premium',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOT_FOUND: '/404',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY: '/auth/verify',
  
  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id) => `/expenses/${id}`,
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  
  // Reports
  DASHBOARD: '/reports/dashboard',
  EXPORT: '/reports/export',
  MONTHLY: '/reports/monthly',
  
  // Premium
  PREMIUM_PURCHASE: '/premium/purchase',
  PREMIUM_VERIFY: '/premium/verify',
  LEADERBOARD: '/premium/leaderboard',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_PASSWORD: '/profile/password',
  PROFILE_PREFERENCES: '/profile/preferences',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_REVENUE: '/admin/revenue',
  
  // Health
  HEALTH: '/healthz',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  EXPENSE_CREATED: 'Expense created successfully',
  EXPENSE_UPDATED: 'Expense updated successfully',
  EXPENSE_DELETED: 'Expense deleted successfully',
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PREFERENCES_UPDATED: 'Preferences updated successfully',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
};

export default {
  API_BASE_URL,
  TOKEN_KEY,
  USER_KEY,
  TOKEN_EXPIRY_HOURS,
  DEFAULT_PAGE_SIZE,
  EXPENSES_PER_PAGE,
  CATEGORIES_PER_PAGE,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
  DEFAULT_CATEGORIES,
  CATEGORY_COLORS,
  DATE_RANGE_OPTIONS,
  CHART_COLORS,
  PREMIUM_PRICE,
  PREMIUM_CURRENCY,
  PREMIUM_FEATURES,
  VALIDATION_RULES,
  TOAST_DURATION,
  TOAST_TYPES,
  DEBOUNCE_DELAY,
  DEBOUNCE_DELAY_LONG,
  ROUTES,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
