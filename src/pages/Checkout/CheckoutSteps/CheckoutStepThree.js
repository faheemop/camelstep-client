import React from 'react';
import { useScrollToTop } from '../../../hooks/useScrollToTop';
import { PaymentForm } from '../../Payment/PaymentForm';

export const CheckoutStepThree = () => {
  useScrollToTop({
    isSmooth: true,
  });

  return <PaymentForm />;
};
