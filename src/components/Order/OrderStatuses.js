export const ORDER_STATUSES = {
  PAYMENT_IN_PROGRESS: 'payment_in_progress',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_TIMEOUT: 'payment_timeout',
  PAYMENT_SUCCESS: 'payment_succeed',
  PICKED_UP: 'customer_picked_up',
  READY_TO_PICKUP: 'ready_to_pickup',
  APPROVED: 'approved',
  IN_DELIVERY: 'in_delivery',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export const orderHasPreparedInvoice = ({ state }) => (
  ![
    ORDER_STATUSES.PAYMENT_FAILED,
    ORDER_STATUSES.PAYMENT_IN_PROGRESS,
    ORDER_STATUSES.PAYMENT_TIMEOUT,
  ].includes(state)
);
