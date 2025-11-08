import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav = ({ isOpen, onClose }) => {
  const { isPremium, isAdmin } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Expenses',
      path: '/expenses',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Premium',
      path: '/premium',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      badge: !isPremium() ? 'Upgrade' : null,
    },
  ];

  const adminNavItems = [
    {
      name: 'Admin Dashboard',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const getLinkClasses = (isActive) => {
    const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200';
    const activeClasses = 'bg-primary-50 text-primary-700 font-medium';
    const inactiveClasses = 'text-secondary-600 hover:bg-secondary-50';
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-secondary-900">Menu</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => getLinkClasses(isActive)}
                aria-label={`Navigate to ${item.name}`}
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span 
                      className={isActive ? 'text-primary-600' : 'text-secondary-400'}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span 
                        className="px-2 py-0.5 text-xs font-semibold rounded-full bg-warning-100 text-warning-700"
                        aria-label={item.badge}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin() && (
            <>
              <div className="pt-6 pb-2">
                <h3 className="px-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              <div className="space-y-1">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => getLinkClasses(isActive)}
                    aria-label={`Navigate to ${item.name}`}
                    aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <span 
                          className={isActive ? 'text-primary-600' : 'text-secondary-400'}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </>
          )}

          {/* Help Section */}
          <div className="pt-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-semibold text-primary-900">Need Help?</h4>
              </div>
              <p className="text-xs text-primary-700 mb-3">
                Check out our documentation for guides and tips.
              </p>
              <a
                href="#"
                className="text-xs font-medium text-primary-600 hover:text-primary-700 underline"
              >
                View Documentation →
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
