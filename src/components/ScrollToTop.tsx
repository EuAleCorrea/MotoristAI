import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure the browser doesn't try to restore scroll position on its own
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    // Scroll to top on path change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
