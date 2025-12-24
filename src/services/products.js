import { api } from './api';

const PRODUCTS_PER_PAGE = 16;

const combineSearchParams = (params) => {
  if (params === undefined || params.length === 0) {
    return '';
  }
  const searchParams = new URLSearchParams();
  params.forEach((param, index) => {
    searchParams.append(params[index].name, params[index].value);
  });
  return `&${searchParams.toString()}`;
};

const getVariantsQueryParams = (variantIds) => {
  const searchParams = new URLSearchParams();
  variantIds.forEach((variantId) => {
    searchParams.append('product_variant_values_ids[]', variantId);
  });
  return `?${searchParams.toString()}`;
};

export const productsApi = api.injectEndpoints({
  reducerPath: 'productsApi',
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ currentPage, filterParams, lang }) => `products?page=${currentPage}&per=${PRODUCTS_PER_PAGE}${combineSearchParams(filterParams)}&lang=${lang}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0.1,
    }),
    getFeaturedProducts: builder.query({
      query: ({ lang }) => `featured_products?lang=${lang}`,
      transformResponse: (response) => response,
      keepUnusedDataFor: 0.1,
    }),
    getPackages: builder.query({
      query: ({ currentPage, searchPackage }) => `packages?page=${currentPage}&per=${PRODUCTS_PER_PAGE}&search=${searchPackage}`,
      transformResponse: (response) => response.data,
    }),
    getSingleProduct: builder.query({
      query: ({ slug: id }) => `products/${id}`,
      keepUnusedDataFor: 0.1,
    }),
    getSinglePackage: builder.query({
      query: (id) => `packages/${id}`,
      keepUnusedDataFor: 0.1,
    }),
    getProductAvailableVariants: builder.query({
      query: (id) => `products/${id}/variants`,
      transformResponse: (response) => response.data.records,
    }),
    getProductModificators: builder.query({
      query: (id) => `products/${id}/modificators`,
      transformResponse: (response) => response.data.records,
    }),
    getProductRecipe: builder.query({
      query: (id) => `products/${id}/how_to_brew`,
      transformResponse: (response) => response.data,
    }),
    getSimilarProducts: builder.query({
      query: (id) => `products/${id}/similar`,
      transformResponse: (response) => response.data.records,
    }),
    getProductFilters: builder.query({
      query: () => 'products/filters',
      transformResponse: (response) => response.filters,
    }),
    getProductVariant: builder.query({
      query: ({ id, variantValuesIds }) => `products/${id}/variants_combinations${getVariantsQueryParams(variantValuesIds)}`,
    }),
    getToolsCategory: builder.query({
      query: () => 'categories',
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetPackagesQuery,
  useGetSingleProductQuery,
  useGetSinglePackageQuery,
  useGetProductRecipeQuery,
  useGetSimilarProductsQuery,
  useGetProductFiltersQuery,
  useGetProductAvailableVariantsQuery,
  useGetProductModificatorsQuery,
  useLazyGetProductRecipeQuery,
  useLazyGetProductVariantQuery,
  useGetFeaturedProductsQuery,
  useGetToolsCategoryQuery,
} = productsApi;
