import { api } from './api';

export const guestApi = api.injectEndpoints({
  reducerPath: 'guestApi',
  endpoints: (builder) => ({
    getGuestSession: builder.mutation({
      query: () => ({
        url: 'guest/session',
        method: 'post',
      }),
    }),
  }),
});

export const { useGetGuestSessionMutation } = guestApi;
