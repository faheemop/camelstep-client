import { useEffect } from 'react';
import i18next from 'i18next';

export const useLangObserver = () => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const htmlTag = document.documentElement;
      const lang = htmlTag.getAttribute('lang');

      if (lang) {
        htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        setTimeout(() => {
          i18next.changeLanguage(lang);
          localStorage.setItem('preferred_language', lang);
        }, 1000);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    return () => observer.disconnect();
  }, []);
};
