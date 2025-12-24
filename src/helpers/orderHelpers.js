import { ORDER_STATUSES } from '../components/Order/OrderStatuses';

export const mapOrderStatusToUiData = (orderStatus) => {
  switch (orderStatus) {
    case ORDER_STATUSES.PAYMENT_IN_PROGRESS:
      return {
        color: '#373C3D',
        name: 'Payment in progress',
        display: false,
      };
    case ORDER_STATUSES.PAYMENT_FAILED:
      return {
        color: '#FD5C5C',
        name: 'Payment failed',
        display: false,
      };
    case ORDER_STATUSES.PAYMENT_SUCCESS:
      return {
        color: '#60C19E',
        name: 'Payment succeed',
        display: true,
      };
    case ORDER_STATUSES.PICKED_UP:
      return {
        color: '#A0845F',
        name: 'Customer picked up',
        display: true,
      };
    case ORDER_STATUSES.READY_TO_PICKUP:
      return {
        color: '#A0845F',
        name: 'Ready to pick up',
        display: true,
      };
    case ORDER_STATUSES.IN_DELIVERY:
      return {
        color: '#00546F',
        name: 'In delivery',
        display: true,
      };
    case ORDER_STATUSES.APPROVED:
      return {
        color: '#00546F',
        name: 'Approved',
        display: true,
      };
    case ORDER_STATUSES.COMPLETED:
      return {
        color: '#00546F',
        name: 'Order completed',
        display: false,
      };
    case ORDER_STATUSES.REJECTED:
      return {
        color: '#FD5C5C',
        name: 'Order rejected',
        display: false,
      };
    default:
      return {
        color: '#373C3D',
        name: 'Payment in progress',
        display: true,
      };
  }
};
