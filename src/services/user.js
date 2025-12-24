import { api } from './api';

export const userApi = api.injectEndpoints({
  reducerPath: 'userApi',
  tagTypes: [
    'NotificationSettings',
    'UserAddresses',
    'ProfileDetails',
    'ProductPreferences',
    'PhoneNumber',
  ],
  endpoints: (builder) => ({
    getProfileDetails: builder.query({
      query: () => 'users/profile_details',
      transformResponse: (response) => response,
      providesTags: ['ProfileDetails'],
    }),
    updateProfileDetails: builder.mutation({
      query: (body) => ({
        url: 'users/profile_details',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ProfileDetails'],
    }),
    getPhoneNumber: builder.query({
      query: () => 'users/phone_number',
      providesTags: ['PhoneNumber'],
    }),
    updatePhoneNumber: builder.mutation({
      query: (body) => ({
        url: 'users/phone_number',
        method: 'put',
        body: {
          new_phone_number: body,
        },
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    confirmNewPhoneNumber: builder.mutation({
      query: (body) => ({
        url: 'users/phone_number/confirm',
        method: 'post',
        body: {
          otp_code: body,
        },
      }),
    }),
    getProductPreferences: builder.query({
      query: () => 'users/product_preferences',
      providesTags: ['ProductPreferences'],
    }),
    updateProductPreferences: builder.mutation({
      query: (body) => ({
        url: 'users/product_preferences',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['ProductPreferences'],
    }),
    getNotificationSettings: builder.query({
      query: () => 'users/notification_settings',
      providesTags: ['NotificationSettings'],
    }),
    setNotificationSettings: builder.mutation({
      query: (body) => ({
        url: 'users/notification_settings',
        method: 'put',
        body: {
          notification_settings: body,
        },
      }),
      invalidatesTags: ['NotificationSettings'],
    }),
    getAddressess: builder.query({
      query: () => 'users/addresses',
      transformResponse: (response) => response.data.records,
      providesTags: ['UserAddresses'],
      invalidatesTags: ['UserAddresses'],
    }),
    createAddress: builder.mutation({
      query: (body) => ({
        url: 'users/addresses',
        method: 'post',
        body: {
          address: body,
        },
      }),
      invalidatesTags: ['UserAddresses'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, body }) => ({
        url: `users/addresses/${id}`,
        method: 'PATCH',
        body: {
          address: body,
        },
      }),
      invalidatesTags: ['UserAddresses'],
    }),
    deleteAddress: builder.mutation({
      query: ({ id }) => ({
        url: `users/addresses/${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['UserAddresses'],
    }),
    getWishlistProducts: builder.query({
      query: () => 'users/products/wishlist_products',
      transformResponse: (response) => response.data.records,
      providesTags: ['WishlistProducts'],
    }),
    addProductToWishlist: builder.mutation({
      query: (id) => ({
        url: `users/products/${id}/wishlist_product`,
        method: 'post',
      }),
      invalidatesTags: ['WishlistProducts'],
    }),
    removeProductFromWishlist: builder.mutation({
      query: (id) => ({
        url: `users/products/${id}/wishlist_product`,
        method: 'delete',
      }),
      invalidatesTags: ['WishlistProducts'],
    }),
    userOrders: builder.query({
      query: ({ page = 1, perPage = 20 }) => `users/orders?page=${page}&per=${perPage}`,
      providesTags: ['UserOrders'],
      transformResponse: (response) => response.data,
    }),
    userOrderDetails: builder.query({
      query: (id) => ({
        url: `users/orders/${id}`,
      }),
    }),
    userOrderLast: builder.query({
      query: () => 'users/last_order',
    }),
    userOrderByPaymentId: builder.query({
      query: (paymentId) => ({
        url: `users/payments/${paymentId}/order`,
      }),
    }),
    updateEmailDetails: builder.mutation({
      query: (body) => ({
        url: 'users/email',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ProfileDetails'],
    }),
    updatePersonalDetails: builder.mutation({
      query: (body) => ({
        url: 'users/profile_details',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ProfileDetails', 'PhoneNumber', 'EmailDetails'],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useSetNotificationSettingsMutation,
  useGetAddressessQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetProfileDetailsQuery,
  useUpdateProfileDetailsMutation,
  useGetPhoneNumberQuery,
  useUpdatePhoneNumberMutation,
  useConfirmNewPhoneNumberMutation,
  useGetWishlistProductsQuery,
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
  useGetProductPreferencesQuery,
  useUpdateProductPreferencesMutation,
  useUserOrdersQuery,
  useUserOrderDetailsQuery,
  useUserOrderLastQuery,
  useUserOrderByPaymentIdQuery,
  useUpdateEmailDetailsMutation,
  useUpdatePersonalDetailsMutation,
} = userApi;
