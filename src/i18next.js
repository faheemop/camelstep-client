import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import application_ar from './translations/ar/application.json';
import application_en from './translations/en/application.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        application: application_en,
      },
      ar: {
        application: application_ar,
      },
    },
    lng: localStorage.getItem('preferred_language') || 'ar',
  });

/* eslint-disable immutable/no-mutation */
document.documentElement.lang = i18next.language === 'en' ? 'en' : 'ar';
document.documentElement.dir = i18next.language === 'en' ? 'ltr' : 'rtl';
