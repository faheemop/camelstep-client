import { api } from './api';

export const citiesApi = api.injectEndpoints({
  reducerPath: 'citiesApi',
  endpoints: (builder) => ({
    getCitySuggestions: builder.query({
      query: ({ inputValue, countryCode }) => ({
        url: process.env.FETCH_CITIES_API,
        method: 'POST',
        body: {
          inputValue,
          countryCode,
        },
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetCitySuggestionsQuery, useLazyGetCitySuggestionsQuery } = citiesApi;
