import { api } from './api';

export const howToBrewApi = api.injectEndpoints({
  reducerPath: 'howToBrewApi',
  endpoints: (builder) => ({
    getFilters: builder.query({
      query: () => 'how_to_brew',
      transformResponse: (response) => response.data.records,
    }),
    getSpecificRecipe: builder.query({
      query: (id) => `how_to_brew/${id}`,
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetFiltersQuery, useGetSpecificRecipeQuery } = howToBrewApi;
