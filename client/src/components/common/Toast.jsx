import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Toast = ({ 
  show = true,
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    setIsVisible(show);
    if (show) {
      setIsExiting(false);
    }
  }, [show]);
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };
  
  if (!isVisible) return null;
  
  const types = {
    success: {
      bg: 'bg-success-50 border-success-500',
      text: 'text-success-800',
      icon: (
        <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-danger-50 border-danger-500',
      text: 'text-danger-800',
      icon: (
        <svg className="w-5 h-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-warning-50 border-warning-500',
      text: 'text-warning-800',
      icon: (
        <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-primary-50 border-primary-500',
      text: 'text-primary-800',
      icon: (
        <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    },
  };
  
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  
  const animations = isExiting 
    ? 'opacity-0 translate-y-2' 
    : 'opacity-100 translate-y-0';
  
  const toastContent = (
    <div 
      className={`fixed ${positions[position]} z-[9999] transition-all duration-300 ease-in-out ${animations}`}
      role="alert"
      aria-live="polite"
    >
      <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg min-w-[300px] max-w-md ${types[type].bg}`}>
        <div className="flex-shrink-0">
          {types[type].icon}
        </div>
        <div className={`flex-1 ${types[type].text}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${types[type].text} opacity-70 hover:opacity-100 transition-opacity focus:outline-none`}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
  
  return createPortal(toastContent, document.body);
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id || index)}
        />
      ))}
    </>
  );
};

export default Toast;
