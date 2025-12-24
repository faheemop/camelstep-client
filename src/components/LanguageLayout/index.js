/* eslint-disable immutable/no-mutation */
import React, { useEffect } from 'react';
import {
  Outlet, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import i18next from 'i18next';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionsModal } from '../PromotionsModal';
import { CookieBanner } from '../CookieBanner/CookieBanner';
import { Menu } from '../Menu/Menu';
import { Cart } from '../Cart/Cart';
import { Overlay } from '../Overlay/Overlay';
import { Modal } from '../Modal/Modal';
import {
  getCookie, getExpiryDateValue, isCookieExpired, setCookie,
} from '../../helpers/cookieHelpers';
import { guestApi } from '../../services/guest';
import { setCurrentStep, setPendingPayment } from '../../features/checkout/checkoutSlice';
import { API_ROOT } from '../../config';
import { CurrentUser } from '../../helpers/CurrentUser';
import { useUnlockCartMutation } from '../../services/cart';
import { useLangObserver } from '../../hooks/useLangObserver';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { localizedPath } from '../../helpers/localizedPath';

export const LanguageLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation('application');
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.checkout.currentStep);
  const isPaymentPending = useSelector((state) => state.checkout.pendingPayment);
  const [unlockCart] = useUnlockCartMutation();

  const { t } = useTranslation('application');
  const navigate = useNavigate();

  let guestSessionCookieTimeout;

  const setGuestUserSessionCookie = () => {
    const result = dispatch(guestApi.endpoints.getGuestSession.initiate());
    result.then((payload) => {
      const cookieExpiryDate = payload.data.guest_session_token_expire_in;
      setCookie('guest_session_token', payload.data.guest_session_token, {
        expiryIn: cookieExpiryDate,
      });
      const expiryDate = getExpiryDateValue(cookieExpiryDate);
      const msToExpire = new Date(expiryDate).getTime() - Date.now();
      setCookie('guest_session_token_expiry', expiryDate.toUTCString(), {
        expiryIn: cookieExpiryDate,
      });
      guestSessionCookieTimeout = setTimeout(() => {
        setGuestUserSessionCookie();
      }, msToExpire);
    });
  };

  useEffect(() => {
    if (getCookie('guest_session_token')) {
      if (isCookieExpired('guest_session_token_expiry')) {
        setGuestUserSessionCookie();
      }
    } else {
      setGuestUserSessionCookie();
    }

    return () => {
      clearTimeout(guestSessionCookieTimeout);
    };
  }, []);

  useEffect(() => {
    const supportedLangs = ['en', 'ar'];

    if (!lang || !supportedLangs.includes(lang)) {
      // Fallback to 'ar' if unsupported
      i18next.changeLanguage('ar');
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      localStorage.setItem('preferred_language', 'ar');
      navigate('/ar', { replace: true });
      return;
    }

    // Valid lang: apply settings
    i18next.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferred_language', lang);
  }, [lang, navigate]);

  const handleBrowserClose = () => {
    // eslint-disable-next-line no-useless-return
    if (currentStep !== 2) return;
    if (document.visibilityState === 'hidden') {
      dispatch(setPendingPayment(false));
      const headers = {
        'Accept-Language': i18n.language,
      };
      const token = CurrentUser.get()?.token;
      const guestSessionToken = getCookie('guest_session_token');
      if (guestSessionToken) {
        // eslint-disable-next-line immutable/no-mutation
        headers['Guest-Session-Token'] = guestSessionToken;
      }
      if (token) {
        // eslint-disable-next-line immutable/no-mutation
        headers['Authentication-Token'] = token;
      }
      const blob = new Blob([], headers);
      navigator.sendBeacon(`${API_ROOT}/v1/users/cancel_last_order`, blob);
    }
  };

  useEffect(() => {
    window.addEventListener('visibilitychange', handleBrowserClose);

    return () => {
      window.removeEventListener('visibilitychange', handleBrowserClose);
    };
  }, [currentStep, isPaymentPending]);

  useEffect(() => {
    if (
      !pathname.startsWith(localizedPath('/checkout')) && currentStep === 2 && isPaymentPending
    ) {
      dispatch(setPendingPayment(false));
      unlockCart();
      dispatch(setCurrentStep(1));
    }
  }, [pathname, currentStep, isPaymentPending]);

  useLangObserver();

  useScrollToTop({
    dependency: pathname,
  });

  return (
    <div className="App">
      <PromotionsModal />
      <CookieBanner />
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
      </Helmet>
      <Outlet />
      <Menu />
      <Cart />
      <Overlay />
      <Modal />
      <ToastContainer position="top-center" limit={3} rtl={lang === 'ar'} />
    </div>
  );
};
