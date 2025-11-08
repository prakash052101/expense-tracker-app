import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * CategoryBadge Component
 * Displays a category as a styled badge with icon and color
 * Memoized to prevent unnecessary re-renders
 */
const CategoryBadge = memo(({ category, size = 'md', className = '' }) => {
  // Memoize badge style to avoid recalculation
  const badgeStyle = useMemo(() => {
    if (!category) return null;
    return {
      backgroundColor: `${category.color}20`,
      color: category.color || '#3B82F6',
    };
  }, [category?.color]);

  if (!category) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 ${className}`}>
        Uncategorized
      </span>
    );
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${className}`}
      style={badgeStyle}
    >
      {category.icon && <span className="mr-1">{category.icon}</span>}
      {category.name}
    </span>
  );
});

CategoryBadge.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    icon: PropTypes.string,
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default CategoryBadge;
