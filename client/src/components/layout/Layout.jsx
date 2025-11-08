import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';

/**
 * Layout Component
 * Main layout wrapper with header, sidebar, and mobile navigation
 */
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header onMenuClick={handleMenuToggle} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation */}
        <MobileNav isOpen={isMobileMenuOpen} onClose={handleMenuClose} />

        {/* Main Content */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto"
          role="main"
          aria-label="Main content"
        >
          <div className="min-h-full">
            {children}
          </div>
          
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
