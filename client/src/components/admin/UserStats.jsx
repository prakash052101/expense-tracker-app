import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * UserStats Component
 * Displays user growth statistics with a simple bar chart
 */
const UserStats = ({ userGrowth }) => {
  // Calculate max value for scaling the bars
  const maxValue = useMemo(() => {
    if (!userGrowth || userGrowth.length === 0) return 0;
    return Math.max(...userGrowth.map(item => item.count));
  }, [userGrowth]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate bar height percentage
  const getBarHeight = (count) => {
    if (maxValue === 0) return 0;
    return (count / maxValue) * 100;
  };

  if (!userGrowth || userGrowth.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Growth (Last 30 Days)
        </h3>
        <p className="text-gray-500 text-center py-8">No user growth data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Growth (Last 30 Days)
      </h3>
      
      <div className="space-y-2">
        {/* Simple bar chart */}
        <div className="flex items-end justify-between h-48 gap-1">
          {userGrowth.map((item, index) => {
            const height = getBarHeight(item.count);
            return (
              <div
                key={item.date || index}
                className="flex-1 flex flex-col items-center justify-end group"
              >
                {/* Bar */}
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative"
                  style={{ height: `${height}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {item.count} user{item.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels - show only first, middle, and last dates */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatDate(userGrowth[0].date)}</span>
          {userGrowth.length > 2 && (
            <span>{formatDate(userGrowth[Math.floor(userGrowth.length / 2)].date)}</span>
          )}
          <span>{formatDate(userGrowth[userGrowth.length - 1].date)}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total New Users</p>
            <p className="text-xl font-semibold text-gray-900">
              {userGrowth.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average per Day</p>
            <p className="text-xl font-semibold text-gray-900">
              {(userGrowth.reduce((sum, item) => sum + item.count, 0) / userGrowth.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

UserStats.propTypes = {
  userGrowth: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default UserStats;
