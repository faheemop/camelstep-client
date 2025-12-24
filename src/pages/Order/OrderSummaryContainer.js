import React from 'react';
import { useParams } from 'react-router-dom';
import { HistoryOrderContainer } from './HistoryOrderContainer';
import { NewOrderContainer } from './NewOrderContainer';

export const OrderSummaryContainer = () => {
  const { id } = useParams();

  return id ? <HistoryOrderContainer id={id} /> : <NewOrderContainer />;
};
