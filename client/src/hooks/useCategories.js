/**
 * Custom hook for category management
 * Provides category CRUD operations with state management
 */

import { useState, useCallback, useEffect } from 'react';
import * as categoryService from '../services/categoryService';

export const useCategories = (autoFetch = true) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getCategories();
      const categoryData = response.data || [];
      setCategories(categoryData);

      return { success: true, data: categoryData };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch categories';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single category by ID
  const getCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getCategoryById(id);
      const category = response.data;

      return { success: true, data: category };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new category
  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.createCategory(categoryData);
      const newCategory = response.data;

      // Add to local state
      setCategories((prev) => [...prev, newCategory]);

      return { success: true, data: newCategory };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing category
  const updateCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.updateCategory(id, categoryData);
      const updatedCategory = response.data;

      // Update in local state
      setCategories((prev) =>
        prev.map((category) => (category._id === id ? updatedCategory : category))
      );

      return { success: true, data: updatedCategory };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await categoryService.deleteCategory(id);

      // Remove from local state
      setCategories((prev) => prev.filter((category) => category._id !== id));

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh categories (re-fetch)
  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  // Get category by ID from local state
  const getCategoryFromState = useCallback(
    (id) => {
      return categories.find((category) => category._id === id);
    },
    [categories]
  );

  // Auto-fetch categories on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
    refreshCategories,
    getCategoryFromState,
  };
};

export default useCategories;
