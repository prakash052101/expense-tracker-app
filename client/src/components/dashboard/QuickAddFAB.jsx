import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * QuickAddFAB Component
 * Floating Action Button for quick expense creation
 * Positioned in bottom-right corner, mobile-friendly
 */
const QuickAddFAB = ({ onClick, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 sm:w-16 sm:h-16
        bg-blue-600 hover:bg-blue-700
        text-white rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-blue-300
        ${isHovered && !disabled ? 'scale-110' : 'scale-100'}
      `}
      aria-label="Add new expense"
      title="Add new expense"
    >
      <svg
        className="w-6 h-6 sm:w-8 sm:h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>

      {/* Ripple effect on click */}
      {isHovered && !disabled && (
        <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
      )}
    </button>
  );
};

QuickAddFAB.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default QuickAddFAB;
