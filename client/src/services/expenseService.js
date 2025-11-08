import api from './api';

/**
 * Expense Service
 * Handles all expense-related API calls
 */

/**
 * Fetch expenses with filters and pagination
 * @param {Object} filters - Filter options (page, limit, startDate, endDate, category)
 * @returns {Promise} Response with expenses and pagination data
 */
export const getExpenses = async (filters = {}) => {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.category && { category: filters.category }),
  };

  const response = await api.get('/expenses', { params });
  return response.data;
};

/**
 * Get single expense by ID
 * @param {String} id - Expense ID
 * @returns {Promise} Response with expense data
 */
export const getExpenseById = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

/**
 * Create new expense
 * @param {Object} expenseData - Expense data (amount, description, date, category, receipt)
 * @returns {Promise} Response with created expense
 */
export const createExpense = async (expenseData) => {
  const formData = new FormData();
  formData.append('amount', expenseData.amount);
  formData.append('description', expenseData.description);
  formData.append('date', expenseData.date);
  
  if (expenseData.category) {
    formData.append('category', expenseData.category);
  }
  
  if (expenseData.receipt) {
    formData.append('receipt', expenseData.receipt);
  }

  const response = await api.post('/expenses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Update existing expense
 * @param {String} id - Expense ID
 * @param {Object} expenseData - Updated expense data
 * @returns {Promise} Response with updated expense
 */
export const updateExpense = async (id, expenseData) => {
  const formData = new FormData();
  
  if (expenseData.amount !== undefined) {
    formData.append('amount', expenseData.amount);
  }
  if (expenseData.description !== undefined) {
    formData.append('description', expenseData.description);
  }
  if (expenseData.date !== undefined) {
    formData.append('date', expenseData.date);
  }
  if (expenseData.category !== undefined) {
    formData.append('category', expenseData.category);
  }
  if (expenseData.receipt) {
    formData.append('receipt', expenseData.receipt);
  }

  const response = await api.put(`/expenses/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Delete expense
 * @param {String} id - Expense ID
 * @returns {Promise} Response confirming deletion
 */
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export default {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
