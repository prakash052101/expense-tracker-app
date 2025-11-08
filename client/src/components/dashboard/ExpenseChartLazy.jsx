import { lazy, Suspense } from 'react';
import Spinner from '../common/Spinner';

// Lazy load the ExpenseChart component to reduce initial bundle size
const ExpenseChart = lazy(() => import('./ExpenseChart'));

/**
 * ExpenseChartLazy Component
 * Wrapper component that lazy loads the ExpenseChart with a loading spinner
 */
const ExpenseChartLazy = (props) => {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Distribution by Category
          </h3>
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        </div>
      }
    >
      <ExpenseChart {...props} />
    </Suspense>
  );
};

export default ExpenseChartLazy;
