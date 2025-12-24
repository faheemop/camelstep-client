import { api } from './api';

export const cartApi = api.injectEndpoints({
  reducerPath: 'cartApi',
  tagTypes: ['CartItems'],
  endpoints: (builder) => ({
    getCartProducts: builder.query({
      query: () => 'carts/products',
      transformResponse: (response) => response.data,
      providesTags: ['CartItems'],
    }),
    createCartProduct: builder.mutation({
      query: (body) => ({
        url: 'carts/products',
        method: 'post',
        body,
      }),
      invalidatesTags: ['CartItems'],
    }),
    updateCartProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `carts/products/${id}`,
        method: 'put',
        body,
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['CartItems'],
    }),
    deleteCartProduct: builder.mutation({
      query: ({ id }) => ({
        url: `carts/products/${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['CartItems'],
    }),
    proceedCartCheckout: builder.mutation({
      query: () => ({
        url: 'carts/cart_payments',
        method: 'post',
      }),
      transformResponse: (response) => response.payments,
    }),
    deleteCart: builder.mutation({
      query: () => ({
        url: 'users/carts',
        method: 'delete',
      }),
      invalidatesTags: ['CartItems'],
    }),
    unlockCart: builder.mutation({
      query: () => ({
        url: 'users/cancel_last_order',
        method: 'post',
      }),
      invalidatesTags: ['CartItems'],
    }),

    // Package Queries
    createCartPackage: builder.mutation({
      query: (body) => ({
        url: 'carts/packages',
        method: 'post',
        body,
      }),
      invalidatesTags: ['CartItems'],
    }),
    getCartPackages: builder.query({
      query: () => 'carts/packages',
      transformResponse: (response) => response.data,
      providesTags: ['CartItems'],
    }),
    updateCartPackage: builder.mutation({
      query: ({ id, body }) => ({
        url: `carts/packages/${id}`,
        method: 'put',
        body,
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['CartItems'],
    }),
    deleteCartPackage: builder.mutation({
      query: ({ id }) => ({
        url: `carts/packages/${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['CartItems'],
    }),
    updateCartState: builder.mutation({
      query: () => ({
        url: 'carts/products/cart_update',
        method: 'PATCH',
        body: {
          state: 'checkout_started',
        },
      }),
    }),
  }),
});

export const {
  useLazyGetCartProductsQuery,
  useGetCartProductsQuery,
  useCreateCartProductMutation,
  useUpdateCartProductMutation,
  useDeleteCartProductMutation,
  useProceedCartCheckoutMutation,
  useDeleteCartMutation,
  useUnlockCartMutation,
  useGetCartPackagesQuery,
  useCreateCartPackageMutation,
  useUpdateCartPackageMutation,
  useDeleteCartPackageMutation,
  useUpdateCartStateMutation,
} = cartApi;
