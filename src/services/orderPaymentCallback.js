import { API_ROOT } from '../config';

export const fetchOrderPaymentCallback = (orderId) => fetch(`${API_ROOT}/backend/callbacks/payments/moyasar/${orderId}`, {
  mode: 'no-cors',
});
