import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../services/reportService';
import { downloadExpensesCSV } from '../services/exportService';
import KPICard from '../components/dashboard/KPICard';
import BudgetWidget from '../components/dashboard/BudgetWidget';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import ExpenseChartLazy from '../components/dashboard/ExpenseChartLazy';
import QuickAddFAB from '../components/dashboard/QuickAddFAB';
import ExpenseModal from '../components/expenses/ExpenseModal';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

/**
 * Dashboard Page
 * Main dashboard displaying KPIs, charts, budget widget, and recent expenses
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
  });

  const currency = user?.preferences?.currency || 'USD';
  const monthlyBudget = user?.preferences?.monthlyBudget;

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardData(filters);
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      category: '',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const result = await downloadExpensesCSV(filters);
      if (!result.success) {
        alert(result.error || 'Failed to download CSV');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to download CSV');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    currentMonth = {},
    previousMonth = {},
    yearToDate = {},
    recentExpenses = [],
    categoryDistribution = [],
  } = dashboardData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Welcome back, {user?.name || 'User'}! Here's your expense overview.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isExporting || loading}
              loading={isExporting}
              className="w-full sm:w-auto"
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
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Download as CSV'}</span>
              <span className="sm:hidden">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
            
            {(filters.startDate || filters.endDate || filters.category) && (
              <button
                onClick={clearFilters}
                className="flex-1 sm:flex-none px-4 py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <KPICard
          title="Current Month"
          value={formatCurrency(currentMonth.total)}
          icon="📊"
          color="blue"
          trend={
            currentMonth.total > previousMonth.total
              ? 'up'
              : currentMonth.total < previousMonth.total
              ? 'down'
              : 'neutral'
          }
          trendLabel={
            previousMonth.total > 0
              ? `${Math.abs(
                  Math.round(
                    ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
                  )
                )}% vs last month`
              : ''
          }
        />

        <KPICard
          title="Previous Month"
          value={formatCurrency(previousMonth.total)}
          icon="📅"
          color="purple"
        />

        <KPICard
          title="Year to Date"
          value={formatCurrency(yearToDate.total)}
          icon="📈"
          color="green"
        />
      </div>

      {/* Budget Widget and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <BudgetWidget
          budget={monthlyBudget}
          spent={currentMonth.total || 0}
          currency={currency}
        />

        <ExpenseChartLazy data={categoryDistribution} currency={currency} />
      </div>

      {/* Recent Expenses */}
      <RecentExpenses expenses={recentExpenses} currency={currency} />

      {/* Quick Add FAB */}
      <QuickAddFAB onClick={() => setIsExpenseModalOpen(true)} disabled={loading} />

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={(expenseData) => {
          // This will be implemented in task 21
          console.log('Expense submitted:', expenseData);
          setIsExpenseModalOpen(false);
          fetchDashboard(); // Refresh dashboard after adding expense
        }}
      />
    </div>
  );
};

export default Dashboard;
