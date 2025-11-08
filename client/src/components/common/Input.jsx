import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
  inputClassName = '',
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const inputId = id || name;
  
  const baseInputStyles = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-secondary-50 disabled:cursor-not-allowed';
  
  const stateStyles = error
    ? 'border-danger-300 text-danger-900 placeholder-danger-300 focus:border-danger-500 focus:ring-danger-500'
    : 'border-secondary-300 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:ring-primary-500';
  
  const paddingStyles = leftIcon && rightIcon 
    ? 'pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base'
    : leftIcon 
    ? 'pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base'
    : rightIcon
    ? 'pl-3 sm:pl-4 pr-9 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base'
    : 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-secondary-700 mb-1.5"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`${baseInputStyles} ${stateStyles} ${paddingStyles} ${inputClassName}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={error ? 'text-danger-500' : 'text-secondary-400'}>{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-secondary-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
