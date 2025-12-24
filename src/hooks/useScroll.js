import { useEffect, useState } from 'react';

export const useScroll = () => {
  const [scrollPercentage, setScrollPercentage] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateScrollPercentage = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollXPercentage = Math.round((window.scrollX / (document.documentElement.scrollWidth - window.innerWidth)) * 100);
      const scrollYPercentage = Math.round((window.scrollY / (documentHeight - windowHeight)) * 100);
      setScrollPercentage({ x: scrollXPercentage, y: scrollYPercentage });
    };

    updateScrollPercentage();

    window.addEventListener('scroll', updateScrollPercentage);

    return () => {
      window.removeEventListener('scroll', updateScrollPercentage);
    };
  }, []);

  return scrollPercentage;
};
