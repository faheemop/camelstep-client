import { api } from './api';

const mapOrderData = (order) => {
  if (!order) {
    return null;
  }

  const mappedOrder = {
    id: order.id,
    products: order.products.map(({ name, quantity }) => ({
      name,
      quantity: parseInt(quantity, 10),
    })),
  };

  return mappedOrder;
};

export const orderFeedbackApi = api.injectEndpoints({
  reducerPath: 'orderFeedback',
  endpoints: (builder) => ({
    getOrderFeedback: builder.query({
      query: (token) => `orders/feedbacks/${token}`,
      transformResponse: ({ feedback_exists, order }) => ({
        feedbackExists: feedback_exists,
        order: mapOrderData(order),
      }),
    }),
    sendOrderFeedback: builder.mutation({
      query: ({ token, feedback }) => ({
        url: `orders/feedbacks/${token}`,
        method: 'PUT',
        body: {
          order_score: feedback.orderScore,
          delivery_score: feedback.deliveryScore,
          feedback_note: feedback.feedbackNote,
        },
      }),
    }),
  }),
});

export const {
  useGetOrderFeedbackQuery,
  useSendOrderFeedbackMutation,
} = orderFeedbackApi;
