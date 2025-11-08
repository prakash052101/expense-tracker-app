import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * KPICard Component
 * Displays a key performance indicator with title, value, and optional trend
 * Memoized to prevent unnecessary re-renders
 */
const KPICard = memo(({ title, value, icon, trend, trendLabel, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const trendColorClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs sm:text-sm font-medium ${trendColorClasses[trend]}`}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'neutral' && '→'}
                {trendLabel && <span className="ml-1">{trendLabel}</span>}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-2 sm:p-3 rounded-lg border ${colorClasses[color]} flex-shrink-0`}>
            <span className="text-xl sm:text-2xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
});

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendLabel: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple']),
};

export default KPICard;
