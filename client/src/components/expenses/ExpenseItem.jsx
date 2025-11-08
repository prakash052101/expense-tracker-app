import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import CategoryBadge from '../categories/CategoryBadge';

/**
 * ExpenseItem Component
 * Displays a single expense row in the expense list table
 * Memoized to prevent unnecessary re-renders
 */
const ExpenseItem = memo(({ expense, currency = 'USD', onEdit, onDelete, isDeleting = false }) => {
  // Memoize formatted date to avoid recalculation on every render
  const formattedDate = useMemo(() => {
    const date = new Date(expense.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [expense.date]);

  // Memoize formatted amount to avoid recalculation on every render
  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(expense.amount);
  }, [expense.amount, currency]);

  return (
    <tr className="hover:bg-secondary-50 transition-colors">
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
        {formattedDate}
      </td>
      <td className="px-4 lg:px-6 py-4 text-sm text-secondary-900">
        <div className="max-w-xs lg:max-w-md truncate" title={expense.description}>
          {expense.description}
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
        <CategoryBadge category={expense.category} />
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
        {formattedAmount}
      </td>
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
        {expense.receiptUrl ? (
          <a
            href={expense.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-900 inline-flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            View
          </a>
        ) : (
          <span className="text-secondary-400">No receipt</span>
        )}
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-primary-600 hover:text-primary-900 transition-colors p-1 rounded hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Edit expense"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(expense._id)}
            disabled={isDeleting}
            className="text-danger-600 hover:text-danger-900 transition-colors p-1 rounded hover:bg-danger-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-danger-500"
            aria-label="Delete expense"
          >
            {isDeleting ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
});

ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.string,
    }),
    receiptUrl: PropTypes.string,
  }).isRequired,
  currency: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

export default ExpenseItem;
