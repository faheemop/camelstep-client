import { api } from './api';

export const promotionsApi = api.injectEndpoints({
  reducerPath: 'prommotionsApi',
  endpoints: (builder) => ({
    getPromotions: builder.query({
      query: () => '/promotions',
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0.1,
    }),
  }),
});

export const { useGetPromotionsQuery } = promotionsApi;
