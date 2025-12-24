import i18next from 'i18next';
import { api } from './api';

export const orderApi = api.injectEndpoints({
  reducerPath: 'orderApi',
  tagTypes: ['UserAddresses'],
  endpoints: (builder) => ({
    getSavedAddresses: builder.query({
      query: () => 'orders/addresses',
      transformResponse: (response) => response.data.records,
      providesTags: ['UserAddresses'],
    }),
    addNewAddress: builder.mutation({
      query: (body) => ({
        url: 'orders/addresses',
        method: 'post',
        body,
      }),
      invalidatesTags: ['UserAddresses'],
    }),
    getShippingOptions: builder.query({
      query: ({ shipmentType, shippingAddressId, preferredLocationId }) => `orders/shipments/?shipment[type]=${shipmentType}&order[shipping_address_id]=${shippingAddressId}${shipmentType === 'pickup' && preferredLocationId ? `&order[preferred_location_id]=${preferredLocationId}` : ''}`,
      refetchOnMountOrArgChange: 0.5,
      keepUnusedDataFor: 0.5,
    }),
    createShipment: builder.mutation({
      query: (body) => ({
        url: 'orders/shipments',
        method: 'post',
        body,
      }),
    }),
    createPayment: builder.mutation({
      query: () => ({
        url: 'orders/payments',
        method: 'post',
        headers: {
          'Accept-Language': i18next.language,
        },
      }),
      transformResponse: ({
        amount, currency, metadata, order, used_discount_code,
      }) => ({
        amount,
        currency,
        metadata,
        usedDiscountCode: used_discount_code,
        order: {
          summaryPrice: order.summary_price,
          totalPrice: order.total_price,
          discountValue: order.discount_value,
          shipmentPrice: order.shipment_price,
          vatPrice: order.vat_price,
          id: order.id,
        },
      }),
    }),
    applyDiscountCode: builder.mutation({
      query: (discountCode) => ({
        url: 'orders/discount_codes',
        method: 'post',
        body: {
          discount_code: discountCode,
        },
      }),
    }),
  }),
});

export const {
  useGetSavedAddressesQuery,
  useAddNewAddressMutation,
  useCreateOrderMutation,
  useGetShippingOptionsQuery,
  useCreateShipmentMutation,
  useCreatePaymentMutation,
  useApplyDiscountCodeMutation,
} = orderApi;
