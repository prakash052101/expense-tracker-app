/**
 * Responsive Utilities
 * Helper functions and constants for responsive design
 */

// Breakpoint constants matching Tailwind's default breakpoints
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '4k': 1920,
};

/**
 * Hook to detect current breakpoint
 * @returns {string} Current breakpoint name
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState('xl');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.sm) setBreakpoint('xs');
      else if (width < BREAKPOINTS.md) setBreakpoint('sm');
      else if (width < BREAKPOINTS.lg) setBreakpoint('md');
      else if (width < BREAKPOINTS.xl) setBreakpoint('lg');
      else if (width < BREAKPOINTS['2xl']) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Check if viewport is mobile size
 * @returns {boolean}
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

/**
 * Check if viewport is tablet size
 * @returns {boolean}
 */
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= BREAKPOINTS.md && width < BREAKPOINTS.lg);
    };

    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  return isTablet;
};

/**
 * Responsive class helper
 * @param {Object} classes - Object with breakpoint keys and class values
 * @returns {string} Combined class string
 */
export const responsiveClass = (classes) => {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (breakpoint === 'base') return className;
      return `${breakpoint}:${className}`;
    })
    .join(' ');
};
