import api from './api';

/**
 * Category Service
 * Handles all category-related API calls
 */

/**
 * Fetch all categories for the authenticated user
 * @returns {Promise} Response with categories
 */
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

/**
 * Get single category by ID
 * @param {String} id - Category ID
 * @returns {Promise} Response with category data
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

/**
 * Create new category
 * @param {Object} categoryData - Category data (name, color, icon)
 * @returns {Promise} Response with created category
 */
export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

/**
 * Update existing category
 * @param {String} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} Response with updated category
 */
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Delete category
 * @param {String} id - Category ID
 * @returns {Promise} Response confirming deletion
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
