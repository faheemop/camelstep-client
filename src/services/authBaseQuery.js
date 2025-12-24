import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import i18next from 'i18next';
import { API_ROOT } from '../config';
import { logUserOut, refreshTokenReceived } from '../features/auth/authSlice';
import { getCookie } from '../helpers/cookieHelpers';
import { CurrentUser } from '../helpers/CurrentUser';

const mutex = new Mutex();

export const authorizedBaseQuery = fetchBaseQuery({
  baseUrl: `${API_ROOT}/backend/api/v1/`,
  prepareHeaders: (headers) => {
    const token = CurrentUser.get()?.token;
    const guestSessionToken = getCookie('guest_session_token');
    if (guestSessionToken) {
      headers.set('Guest-Session-Token', guestSessionToken);
    }
    if (token) {
      headers.set('Authentication-Token', token);
    }
    headers.set('Accept-Language', i18next.language);
    return headers;
  },
});

const baseQuery = fetchBaseQuery({ baseUrl: `${API_ROOT}/backend/api/v1/` });

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await authorizedBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: 'users/session',
            method: 'PUT',
            body: {
              refresh_token: CurrentUser.get()?.refresh_token,
              user_id: CurrentUser.get()?.user_id,
            },
          },
          api,
          extraOptions,
        );
        if (refreshResult.data) {
          api.dispatch(refreshTokenReceived(refreshResult.data.data));
          result = await authorizedBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logUserOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await authorizedBaseQuery(args, api, extraOptions);
    }
  }
  return result;
};
