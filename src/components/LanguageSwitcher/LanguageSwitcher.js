/* eslint-disable immutable/no-mutation */
import i18next from 'i18next';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button/Button';

import './langaugeSwitcher.scss';

const SUPPORTED_LANGUAGES = ['en', 'ar'];

export const LanguageSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === 'en' ? 'ar' : 'en';

    // Update i18next and related settings
    i18next.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferred_language', newLang);

    // Parse current path segments
    const segments = location.pathname.split('/');

    if (SUPPORTED_LANGUAGES.includes(segments[1])) {
      // Replace language prefix
      segments[1] = newLang;
    } else {
      // Insert language prefix at the beginning of path
      segments.splice(1, 0, newLang);
    }

    const newPath = segments.join('/');
    navigate(newPath + location.search + location.hash, { replace: true });
  };

  return (
    <Button
      type="naked"
      className="language-switcher"
      onClick={handleLanguageChange}
      style={{ fontWeight: i18next.language === 'en' ? '900' : '400' }}
      text={i18next.language === 'en' ? 'ع' : 'EN'}
    />
  );
};
