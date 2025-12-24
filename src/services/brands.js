import { api } from "./api";

export const brandsApi = api.injectEndpoints({
  reducerPath: "brandsApi",
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => "brands",
      transformResponse: (response) => response.data.records,
    }),
  }),
});

export const { useGetBrandsQuery } = brandsApi;
