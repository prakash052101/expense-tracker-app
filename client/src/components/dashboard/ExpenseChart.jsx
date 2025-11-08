import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * ExpenseChart Component
 * Displays a pie chart showing expense distribution by category
 * Implements responsive sizing for mobile and desktop
 */
const ExpenseChart = ({ data, currency = 'USD' }) => {
  // Default colors for categories
  const DEFAULT_COLORS = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      name: item.category?.name || item.name || 'Uncategorized',
      value: item.amount || item.value || 0,
      color: item.category?.color || item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));
  }, [data]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expense Distribution
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">No expense data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Expense Distribution by Category
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary Table for Mobile */}
      <div className="mt-6 lg:hidden">
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div
              key={`summary-${index}`}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ExpenseChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      amount: PropTypes.number,
      color: PropTypes.string,
      category: PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string,
      }),
    })
  ).isRequired,
  currency: PropTypes.string,
};

export default ExpenseChart;
