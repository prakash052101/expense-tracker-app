import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpense } from '../contexts/ExpenseContext';
import { downloadExpensesCSV } from '../services/exportService';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseModal from '../components/expenses/ExpenseModal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';

/**
 * Expenses Page
 * Main page for managing expenses with filtering, pagination, and CRUD operations
 */
const Expenses = () => {
  const { user } = useAuth();
  const {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    clearError,
  } = useExpense();

  const currency = user?.preferences?.currency || 'USD';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async (customFilters = {}) => {
    const filterParams = {
      page: 1,
      limit: 20,
      ...filters,
      ...customFilters,
    };

    // Remove empty filters
    Object.keys(filterParams).forEach((key) => {
      if (!filterParams[key]) {
        delete filterParams[key];
      }
    });

    await fetchExpenses(filterParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadExpenses(newFilters);
  };

  const handlePageChange = (page) => {
    loadExpenses({ ...filters, page });
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    const result = await deleteExpense(id);
    
    if (result.success) {
      showToast('Expense deleted successfully', 'success');
    } else {
      showToast(result.error || 'Failed to delete expense', 'error');
    }
  };

  const handleSubmitExpense = async (expenseData) => {
    console.log('Submitting expense:', expenseData);
    let result;

    if (selectedExpense) {
      // Update existing expense
      result = await updateExpense(selectedExpense._id, expenseData);
    } else {
      // Create new expense
      result = await createExpense(expenseData);
    }

    console.log('Expense submission result:', result);

    if (result.success) {
      showToast(
        selectedExpense ? 'Expense updated successfully' : 'Expense created successfully',
        'success'
      );
      setIsModalOpen(false);
      setSelectedExpense(null);
      
      // Reload expenses to get updated data
      console.log('Reloading expenses...');
      await loadExpenses();
      console.log('Expenses reloaded, count:', expenses.length);
    } else {
      throw new Error(result.error || 'Failed to save expense');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: '', type: 'success' });
    clearError();
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const result = await downloadExpensesCSV(filters);
      if (result.success) {
        showToast('Expenses exported successfully', 'success');
      } else {
        showToast(result.error || 'Failed to download CSV', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('Failed to download CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Expenses</h1>
            <p className="mt-1 text-sm text-secondary-600">
              Manage and track all your expenses
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isExporting || loading}
              loading={isExporting}
              leftIcon={
                !isExporting && (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              }
            >
              {isExporting ? 'Exporting...' : 'Download CSV'}
            </Button>
            <Button
              variant="primary"
              onClick={handleAddExpense}
              leftIcon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Add Expense
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ExpenseFilters onFilterChange={handleFilterChange} initialFilters={filters} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-lg bg-danger-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-danger-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-danger-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearError}
                className="inline-flex text-danger-400 hover:text-danger-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        pagination={pagination}
        currency={currency}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onPageChange={handlePageChange}
      />

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitExpense}
        expense={selectedExpense}
      />

      {/* Toast Notifications */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Expenses;
