/* eslint-disable immutable/no-mutation */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { localizedPath } from '../../helpers/localizedPath';
import { CurrentUser } from '../../helpers/CurrentUser';
import { cartApi } from '../../services/cart';
import { useGoogleSessionMutation } from '../../services/api';

export const RedirectToDefaultLanguage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [confirmCode] = useGoogleSessionMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const otp = params.get('otp_code');
    const result = params.get('result');
    const email = params.get('user_email');

    const handleLangRedirect = () => {
      const preferredLang = localStorage.getItem('preferred_language');

      let detectedLang;
      if (window.location.pathname.startsWith('/en')) {
        detectedLang = 'en';
      } else if (window.location.pathname.startsWith('/ar')) {
        detectedLang = 'ar';
      }

      const langToUse = detectedLang || preferredLang || 'ar';

      if (window.location.pathname === '/' && langToUse) {
        navigate(`/${langToUse}`, { replace: true });
      }
    };

    if (!result) {
      handleLangRedirect();
      return;
    }
    if (result !== 'success') {
      navigate(localizedPath('/login'));
      return;
    }
    const auth = async () => {
      const payloadSchema = {
        google_session: {
          email,
          otp_code: otp,
        },
      };
      try {
        const confirmCodeResult = await confirmCode(payloadSchema).unwrap();
        CurrentUser.set(confirmCodeResult?.data);
        if (location.state !== null) {
          navigate(localizedPath(location.state.prevPath));
        } else {
          navigate(localizedPath('/'));
        }
        dispatch(cartApi.util.invalidateTags(['CartItems']));
        handleLangRedirect();
      } catch (err) {
        const error = Object.values(err?.data?.errors)?.[0];
        navigate(localizedPath('/login?google-error'));
        toast(error.join('\n'), { type: 'error' });
      }
    };
    auth();
  }, []);

  return null;
};
