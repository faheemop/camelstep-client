import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authBaseQuery';

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export const authApi = api.injectEndpoints({
  reducerPath: 'authApi',
  endpoints: (builder) => ({
    sendLoginVerificationCode: builder.mutation({
      query: (body) => ({
        url: 'users/session',
        method: 'POST',
        body,
      }),
    }),
    confirmLoginCode: builder.mutation({
      query: (body) => ({
        url: 'users/session/confirm',
        method: 'POST',
        body,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: 'users/session',
        method: 'DELETE',
      }),
    }),
    googleSession: builder.mutation({
      query: (body) => ({
        url: 'users/google_session/confirm',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendLoginVerificationCodeMutation,
  useConfirmLoginCodeMutation,
  useUpdateTokenMutation,
  useLogoutUserMutation,
  useGoogleSessionMutation,
} = authApi;
