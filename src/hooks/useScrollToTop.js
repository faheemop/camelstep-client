import { useEffect } from 'react';

export const useScrollToTop = ({ isSmooth = false, dependency = null }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: isSmooth ? 'smooth' : 'auto' });
  }, [dependency]);
};
