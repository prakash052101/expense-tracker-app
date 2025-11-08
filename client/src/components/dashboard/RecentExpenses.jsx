import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CategoryBadge from '../categories/CategoryBadge';

/**
 * RecentExpenses Component
 * Displays a list of recent expenses with amount, description, date, and category
 */
const RecentExpenses = ({ expenses, currency = 'USD', onExpenseClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Format as MMM DD
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No expenses yet</p>
          <Link
            to="/expenses"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Expense
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <Link
          to="/expenses"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {sortedExpenses.map((expense) => (
          <div
            key={expense._id}
            onClick={() => onExpenseClick && onExpenseClick(expense)}
            className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
              onExpenseClick ? 'cursor-pointer' : ''
            }`}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Category Badge */}
              {expense.category && (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: expense.category.color || '#3B82F6',
                    opacity: 0.2,
                  }}
                >
                  <span
                    className="text-lg"
                    style={{ color: expense.category.color || '#3B82F6' }}
                  >
                    {expense.category.icon || '📁'}
                  </span>
                </div>
              )}

              {/* Expense Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {expense.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-600">{formatDate(expense.date)}</p>
                  {expense.category && (
                    <>
                      <span className="text-gray-400">•</span>
                      <p className="text-xs text-gray-600 truncate">
                        {expense.category.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
              {expense.receiptUrl && (
                <p className="text-xs text-gray-500 mt-1">📎 Receipt</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {expenses.length >= 7 && (
        <div className="mt-4 text-center">
          <Link
            to="/expenses"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Expenses →
          </Link>
        </div>
      )}
    </div>
  );
};

RecentExpenses.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string,
        icon: PropTypes.string,
      }),
      receiptUrl: PropTypes.string,
    })
  ).isRequired,
  currency: PropTypes.string,
  onExpenseClick: PropTypes.func,
};

export default RecentExpenses;
