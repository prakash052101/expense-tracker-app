import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const ExpenseContext = createContext(null);

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Fetch expenses with filters and pagination
  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.category && { category: filters.category }),
      };

      const response = await api.get('/expenses', { params });
      const { expenses: expenseData, pagination: paginationData } = response.data.data;

      setExpenses(expenseData);
      setPagination(paginationData);

      return { success: true, data: expenseData };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch expenses';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single expense by ID
  const getExpense = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/expenses/${id}`);
      const expense = response.data.data;

      return { success: true, data: expense };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch expense';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new expense
  const createExpense = useCallback(async (expenseData) => {
    setLoading(true);
    setError(null);

    try {
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

      const newExpense = response.data.data;

      // Add to local state
      setExpenses((prev) => [newExpense, ...prev]);

      return { success: true, data: newExpense };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create expense';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing expense
  const updateExpense = useCallback(async (id, expenseData) => {
    setLoading(true);
    setError(null);

    try {
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

      const updatedExpense = response.data.data;

      // Update in local state
      setExpenses((prev) =>
        prev.map((expense) => (expense._id === id ? updatedExpense : expense))
      );

      return { success: true, data: updatedExpense };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update expense';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/expenses/${id}`);

      // Remove from local state
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete expense';
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

  // Refresh expenses (re-fetch with current filters)
  const refreshExpenses = useCallback(async () => {
    await fetchExpenses({ page: pagination.page, limit: pagination.limit });
  }, [fetchExpenses, pagination.page, pagination.limit]);

  const value = {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    clearError,
    refreshExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export default ExpenseContext;
