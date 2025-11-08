import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { trapFocus, FocusManager } from '../../utils/accessibility';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  footer,
  className = ''
}) => {
  const modalRef = useRef(null);
  const focusManagerRef = useRef(new FocusManager());

  useEffect(() => {
    if (!isOpen) return;
    
    // Save current focus
    focusManagerRef.current.saveFocus();
    
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    // Trap focus within modal
    let cleanupFocusTrap;
    if (modalRef.current) {
      cleanupFocusTrap = trapFocus(modalRef.current);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      if (cleanupFocusTrap) cleanupFocusTrap();
      
      // Restore focus when modal closes
      focusManagerRef.current.restoreFocus();
    };
  }, [isOpen, closeOnEscape, onClose]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  };
  
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg sm:rounded-xl shadow-2xl w-full ${sizes[size]} my-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary-200 flex-shrink-0">
            {title && (
              <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-secondary-900 pr-2">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 rounded-lg hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0"
                aria-label="Close modal"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-lg sm:rounded-b-xl flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};

export default Modal;
