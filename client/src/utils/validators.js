/**
 * Utility functions for form validation
 */

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} { isValid: Boolean, errors: Array }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {String} fieldName - Name of the field for error message
 * @returns {String|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate number is positive
 * @param {Number} value - Number to validate
 * @param {String} fieldName - Name of the field for error message
 * @returns {String|null} Error message or null if valid
 */
export const validatePositiveNumber = (value, fieldName = 'Value') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (num <= 0) {
    return `${fieldName} must be greater than 0`;
  }
  
  return null;
};

/**
 * Validate date is valid
 * @param {String|Date} date - Date to validate
 * @param {String} fieldName - Name of the field for error message
 * @returns {String|null} Error message or null if valid
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return `${fieldName} is required`;
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} is not a valid date`;
  }
  
  return null;
};

/**
 * Validate date is not in the future
 * @param {String|Date} date - Date to validate
 * @param {String} fieldName - Name of the field for error message
 * @returns {String|null} Error message or null if valid
 */
export const validateDateNotFuture = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  now.setHours(23, 59, 59, 999); // End of today
  
  if (dateObj > now) {
    return `${fieldName} cannot be in the future`;
  }
  
  return null;
};

/**
 * Validate string length
 * @param {String} value - String to validate
 * @param {Number} min - Minimum length
 * @param {Number} max - Maximum length
 * @param {String} fieldName - Name of the field for error message
 * @returns {String|null} Error message or null if valid
 */
export const validateLength = (value, min, max, fieldName = 'Field') => {
  if (!value) {
    return `${fieldName} is required`;
  }
  
  const length = value.trim().length;
  
  if (length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  
  if (max && length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  
  return null;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {String|null} Error message or null if valid
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']) => {
  if (!file) {
    return null; // File is optional
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {Number} maxSizeMB - Maximum file size in MB (default: 5)
 * @returns {String|null} Error message or null if valid
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) {
    return null; // File is optional
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  
  return null;
};

/**
 * Validate expense form data
 * @param {Object} data - Expense form data
 * @returns {Object} { isValid: Boolean, errors: Object }
 */
export const validateExpenseForm = (data) => {
  const errors = {};
  
  const amountError = validatePositiveNumber(data.amount, 'Amount');
  if (amountError) errors.amount = amountError;
  
  const descriptionError = validateLength(data.description, 1, 200, 'Description');
  if (descriptionError) errors.description = descriptionError;
  
  const dateError = validateDateNotFuture(data.date, 'Date');
  if (dateError) errors.date = dateError;
  
  if (data.receipt) {
    const fileTypeError = validateFileType(data.receipt);
    if (fileTypeError) errors.receipt = fileTypeError;
    
    const fileSizeError = validateFileSize(data.receipt);
    if (fileSizeError) errors.receipt = fileSizeError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate category form data
 * @param {Object} data - Category form data
 * @returns {Object} { isValid: Boolean, errors: Object }
 */
export const validateCategoryForm = (data) => {
  const errors = {};
  
  const nameError = validateLength(data.name, 1, 50, 'Category name');
  if (nameError) errors.name = nameError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form data
 * @param {Object} data - Login form data
 * @returns {Object} { isValid: Boolean, errors: Object }
 */
export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate registration form data
 * @param {Object} data - Registration form data
 * @returns {Object} { isValid: Boolean, errors: Object }
 */
export const validateRegisterForm = (data) => {
  const errors = {};
  
  const nameError = validateLength(data.name, 2, 100, 'Name');
  if (nameError) errors.name = nameError;
  
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0]; // Show first error
  }
  
  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  validatePassword,
  validateRequired,
  validatePositiveNumber,
  validateDate,
  validateDateNotFuture,
  validateLength,
  validateFileType,
  validateFileSize,
  validateExpenseForm,
  validateCategoryForm,
  validateLoginForm,
  validateRegisterForm,
};
