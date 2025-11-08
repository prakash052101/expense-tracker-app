import React from 'react';

const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text,
  className = '' 
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-success-600',
    danger: 'text-danger-600',
    warning: 'text-warning-600',
    white: 'text-white',
  };
  
  const spinner = (
    <div className={`inline-block ${className}`} role="status" aria-live="polite">
      <svg 
        className={`animate-spin ${sizes[size]} ${colors[color]}`}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
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
      <span className="sr-only">{text || 'Loading...'}</span>
      {text && (
        <span className={`ml-2 text-sm ${colors[color]}`} aria-hidden="true">
          {text}
        </span>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          {spinner}
          {text && (
            <p className="mt-4 text-secondary-600 text-base">{text}</p>
          )}
        </div>
      </div>
    );
  }
  
  return spinner;
};

export default Spinner;
