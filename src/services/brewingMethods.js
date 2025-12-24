import { api } from './api';

export const brewingMethodsApi = api.injectEndpoints({
  reducerPath: 'brewingMethodsApi',
  endpoints: (builder) => ({
    getBrewingMethods: builder.query({
      query: () => 'brewing_methods',
      transformResponse: (response) => response.data.records,
    }),
  }),
});

export const { useGetBrewingMethodsQuery } = brewingMethodsApi;
