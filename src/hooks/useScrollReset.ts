import { useEffect } from 'react';

/**
 * Hook to reset scroll position of the main container when a value changes.
 * Useful for internal tabs/filters that don't change the URL.
 */
export const useScrollReset = (dependency: any) => {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, [dependency]);
};
