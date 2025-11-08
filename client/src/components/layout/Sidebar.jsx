import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { isPremium, isAdmin } = useAuth();

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
      badgeColor: 'warning',
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
    const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group';
    const activeClasses = 'bg-primary-50 text-primary-700 font-medium';
    const inactiveClasses = 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900';
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <aside 
      className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-secondary-200 h-[calc(100vh-4rem)] sticky top-16"
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" aria-label="Primary navigation menu">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => getLinkClasses(isActive)}
              aria-label={`Navigate to ${item.name}`}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              {({ isActive }) => (
                <>
                  <span 
                    className={isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span 
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        item.badgeColor === 'warning' 
                          ? 'bg-warning-100 text-warning-700' 
                          : 'bg-primary-100 text-primary-700'
                      }`}
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
                  className={({ isActive }) => getLinkClasses(isActive)}
                  aria-label={`Navigate to ${item.name}`}
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <span 
                        className={isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'}
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
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-secondary-200">
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
    </aside>
  );
};

export default Sidebar;
