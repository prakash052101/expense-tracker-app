/**
 * Accessibility Utilities
 * Helper functions for improving accessibility
 */

/**
 * Trap focus within a modal or dialog
 * @param {HTMLElement} element - The container element
 */
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Generate unique ID for form elements
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
let idCounter = 0;
export const generateId = (prefix = 'id') => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Check if element is visible to screen readers
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
export const isVisibleToScreenReader = (element) => {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true'
  );
};

/**
 * Get descriptive error message for form validation
 * @param {string} fieldName - Name of the field
 * @param {string} errorType - Type of error
 * @returns {string} Descriptive error message
 */
export const getFormErrorMessage = (fieldName, errorType) => {
  const messages = {
    required: `${fieldName} is required. Please provide a value.`,
    email: `Please enter a valid email address for ${fieldName}.`,
    minLength: `${fieldName} must be at least the minimum length.`,
    maxLength: `${fieldName} exceeds the maximum length allowed.`,
    pattern: `${fieldName} format is invalid. Please check your input.`,
    min: `${fieldName} value is below the minimum allowed.`,
    max: `${fieldName} value exceeds the maximum allowed.`,
    custom: `${fieldName} validation failed. Please check your input.`,
  };

  return messages[errorType] || `${fieldName} is invalid.`;
};

/**
 * Create skip link for keyboard navigation
 * @param {string} targetId - ID of the main content
 * @returns {HTMLElement} Skip link element
 */
export const createSkipLink = (targetId = 'main-content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg';
  skipLink.textContent = 'Skip to main content';
  
  return skipLink;
};

/**
 * Manage focus restoration after modal close
 */
export class FocusManager {
  constructor() {
    this.previousFocus = null;
  }

  saveFocus() {
    this.previousFocus = document.activeElement;
  }

  restoreFocus() {
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }
}
