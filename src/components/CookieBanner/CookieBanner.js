import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  getCookie,
  setCookie,
} from '../../helpers/cookieHelpers';
import './CookieBanner.scss';

export const CookieBanner = () => {
  const { t } = useTranslation('application', { keyPrefix: 'cookieBanner' });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookie = getCookie('cookieConsent');
    if (!cookie) {
      setShowBanner(true);
    }
  }, []);

  const handleCookieClick = () => {
    setCookie('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="consent-container">
      <div className="text-section">
        <div
          className="banner-text"
        />
        <p className="banner-text">
          {t('firstPassage')}
          {' '}
          <NavLink to="/policy">
            {t('privacyLinkLabel')}
          </NavLink>
        </p>
        <p className="banner-heading">{t('passageHeading')}</p>
        <p className="banner-text">
          {t('secondPassage')}
        </p>
      </div>
      <div className="consent-button-section">
        <button className="consent-btn" type="button" onClick={handleCookieClick}>{ t('buttonText')}</button>
      </div>
    </div>
  );
};
