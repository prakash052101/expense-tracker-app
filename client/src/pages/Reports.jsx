import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMonthlyReport } from '../services/reportService';
import { downloadExpensesCSV } from '../services/exportService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import {
  formatCurrency,
  formatMonth,
  getCurrentMonth,
  getPreviousMonth,
} from '../utils/formatters';

/**
 * Reports Page
 * Displays monthly summaries, category breakdowns, and export functionality
 */
const Reports = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const currency = user?.preferences?.currency || 'USD';

  useEffect(() => {
    fetchMonthlyReport();
  }, [selectedMonth]);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMonthlyReport(selectedMonth);
      setReportData(response.data);
    } catch (err) {
      console.error('Failed to fetch monthly report:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setSelectedMonth(getPreviousMonth(selectedMonth));
    } else {
      // Next month
      const [year, month] = selectedMonth.split('-');
      const nextDate = new Date(year, parseInt(month), 1);
      const nextYear = nextDate.getFullYear();
      const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
      setSelectedMonth(`${nextYear}-${nextMonth}`);
    }
  };

  const handleExportWithFilters = async () => {
    setIsExporting(true);
    try {
      const filters = {
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
        ...(selectedCategories.length > 0 && { category: selectedCategories.join(',') }),
      };

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

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !reportData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Report</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchMonthlyReport}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    month = {},
    categoryBreakdown = [],
    topExpenses = [],
  } = reportData || {};

  const totalExpenses = month.total || 0;
  const expenseCount = month.count || 0;
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">
          View detailed expense reports and export your data
        </p>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleMonthChange('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {formatMonth(selectedMonth)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Monthly Summary</p>
          </div>

          <button
            onClick={() => handleMonthChange('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
            disabled={selectedMonth >= getCurrentMonth()}
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalExpenses, currency)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Number of Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{expenseCount}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="h-8 w-8 text-purple-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(averageExpense, currency)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        
        {categoryBreakdown.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No expenses recorded for this month
          </p>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map((category) => {
              const percentage = totalExpenses > 0 
                ? (category.total / totalExpenses) * 100 
                : 0;

              return (
                <div key={category._id || category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      />
                      <span className="font-medium text-gray-900">
                        {category.name || 'Uncategorized'}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({category.count} {category.count === 1 ? 'expense' : 'expenses'})
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(category.total, currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color || '#3B82F6',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Expenses */}
      {topExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Expenses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {expense.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      {formatCurrency(expense.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <p className="text-gray-600 mb-4">
          Download your expense data as CSV with optional filters
        </p>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filters */}
        {categoryBreakdown.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Categories (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryBreakdown.map((category) => (
                <button
                  key={category._id || category.name}
                  onClick={() => handleCategoryToggle(category._id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategories.includes(category._id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name || 'Uncategorized'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleExportWithFilters}
            disabled={isExporting}
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
        </div>
      </div>
    </div>
  );
};

export default Reports;
