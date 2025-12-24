import React from 'react';

import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { useUserOrderDetailsQuery } from '../../services/user';
import { NotFoundPage } from '../404NotFound/NotFoundPage';
import { OrderSummary } from './OrderSummary';

export const HistoryOrderContainer = ({ id }) => {
  const { data: order, error, isLoading } = useUserOrderDetailsQuery(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <NotFoundPage />;
  }

  if (order) {
    return <OrderSummary order={order} type="history" />;
  }

  return null;
};
