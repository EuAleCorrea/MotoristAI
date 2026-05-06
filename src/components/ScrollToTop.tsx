import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
 const { pathname, search } = useLocation();

 useEffect(() => {
 // Ensure the browser doesn't try to restore scroll position on its own
 if (window.history.scrollRestoration) {
 window.history.scrollRestoration = 'manual';
 }
 // Scroll to top of window
 window.scrollTo(0, 0);

 // Scroll to top of the main container (used in Layout)
 const mainElement = document.querySelector('main');
 if (mainElement) {
   mainElement.scrollTop = 0;
 }
 }, [pathname, search]);

 return null;
};

export default ScrollToTop;
