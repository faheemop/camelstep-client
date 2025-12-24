/* eslint-disable no-undef */
import React, { useEffect } from 'react';

import './googleButton.scss';

import { useTranslation } from 'react-i18next';
import { API_ROOT, GOOGLE_AUTH_ID } from '../../../config';

export const GoogleButton = () => {
  const { i18n } = useTranslation('application');

  useEffect(() => {
    // eslint-disable-next-line immutable/no-mutation
    const init = () => {
      google.accounts.id.initialize({
        client_id: GOOGLE_AUTH_ID,
        ux_mode: 'redirect',
        login_uri: `${API_ROOT}/backend/callbacks/authentications/google_oauth2`,
        context: 'signin',
        allowed_parent_origin: 'https://*.int.railwaymen.org',
      });
      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        {
          theme: 'outline', size: 'large', locale: i18n.language, shape: 'pill',
        }, // customization attributes
      );
      google.accounts.id.prompt(); // also display the One Tap dialog

      setTimeout(() => {
        const btnInner = document.querySelector('#google-btn iframe')?.parentElement;
        if (btnInner) {
          btnInner.style.setProperty('width', '945px', 'important');
        }
      }, 1000);
    };
    const checkGoogle = setInterval(() => {
      if (window?.google?.accounts) {
        init();
        clearInterval(checkGoogle);
      }
    }, 200);
  }, [i18n.language]);

  return (
    <div id="google-btn" className="google-button" key={`google-${i18n.language}`} />
  );
};
