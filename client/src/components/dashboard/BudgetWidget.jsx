import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * BudgetWidget Component
 * Displays budget progress with spent amount, remaining amount, and percentage
 */
const BudgetWidget = ({ budget, spent, currency = 'USD' }) => {
  const budgetData = useMemo(() => {
    if (!budget || budget <= 0) {
      return null;
    }

    const remaining = budget - spent;
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOverBudget = spent > budget;

    return {
      remaining: Math.max(remaining, 0),
      percentage: Math.round(percentage),
      isOverBudget,
    };
  }, [budget, spent]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!budgetData) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget</h3>
        <p className="text-sm text-gray-600">
          No budget set. Set a monthly budget in your profile settings to track spending.
        </p>
      </div>
    );
  }

  const { remaining, percentage, isOverBudget } = budgetData;

  const progressColor = useMemo(() => {
    if (isOverBudget) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  }, [percentage, isOverBudget]);

  const statusColor = useMemo(() => {
    if (isOverBudget) return 'text-red-600';
    if (percentage >= 90) return 'text-yellow-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  }, [percentage, isOverBudget]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Budget</h3>
        <span className={`text-sm font-medium ${statusColor}`}>
          {isOverBudget ? 'Over Budget' : `${percentage}% Used`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-300 ease-in-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Budget Details */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Budget</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(budget)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Spent</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(spent)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Remaining</p>
          <p className={`text-sm font-semibold ${statusColor}`}>
            {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {isOverBudget && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ⚠️ You've exceeded your monthly budget by {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      )}
    </div>
  );
};

BudgetWidget.propTypes = {
  budget: PropTypes.number,
  spent: PropTypes.number.isRequired,
  currency: PropTypes.string,
};

export default BudgetWidget;
