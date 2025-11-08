import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

/**
 * RevenueChart Component
 * Displays revenue visualization with purchase timeline
 */
const RevenueChart = ({ recentPurchases }) => {
  // Group purchases by date and calculate daily revenue
  const dailyRevenue = useMemo(() => {
    if (!recentPurchases || recentPurchases.length === 0) return [];

    const revenueMap = {};
    
    recentPurchases.forEach(purchase => {
      if (purchase.status === 'success') {
        const date = new Date(purchase.createdAt).toLocaleDateString();
        if (!revenueMap[date]) {
          revenueMap[date] = {
            date,
            amount: 0,
            count: 0,
          };
        }
        revenueMap[date].amount += purchase.amount || 0;
        revenueMap[date].count += 1;
      }
    });

    return Object.values(revenueMap).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [recentPurchases]);

  // Calculate max value for scaling
  const maxAmount = useMemo(() => {
    if (dailyRevenue.length === 0) return 0;
    return Math.max(...dailyRevenue.map(item => item.amount));
  }, [dailyRevenue]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return dailyRevenue.reduce((sum, item) => sum + item.amount, 0);
  }, [dailyRevenue]);

  // Calculate bar height percentage
  const getBarHeight = (amount) => {
    if (maxAmount === 0) return 0;
    return (amount / maxAmount) * 100;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!recentPurchases || recentPurchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Overview
        </h3>
        <p className="text-gray-500 text-center py-8">No revenue data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue Overview
      </h3>

      {dailyRevenue.length > 0 ? (
        <>
          {/* Bar chart */}
          <div className="space-y-2">
            <div className="flex items-end justify-between h-48 gap-2">
              {dailyRevenue.map((item, index) => {
                const height = getBarHeight(item.amount);
                return (
                  <div
                    key={item.date || index}
                    className="flex-1 flex flex-col items-center justify-end group"
                  >
                    {/* Bar */}
                    <div
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors relative"
                      style={{ height: `${height}%`, minHeight: item.amount > 0 ? '4px' : '0' }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          <div>{formatCurrency(item.amount)}</div>
                          <div className="text-gray-300">{item.count} purchase{item.count !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {dailyRevenue.length > 0 && <span>{formatDate(dailyRevenue[0].date)}</span>}
              {dailyRevenue.length > 2 && (
                <span>{formatDate(dailyRevenue[Math.floor(dailyRevenue.length / 2)].date)}</span>
              )}
              {dailyRevenue.length > 1 && <span>{formatDate(dailyRevenue[dailyRevenue.length - 1].date)}</span>}
            </div>
          </div>

          {/* Summary stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Purchases</p>
                <p className="text-xl font-semibold text-gray-900">
                  {dailyRevenue.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">No successful purchases yet</p>
      )}
    </div>
  );
};

RevenueChart.propTypes = {
  recentPurchases: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      amount: PropTypes.number,
      status: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ).isRequired,
};

export default RevenueChart;
