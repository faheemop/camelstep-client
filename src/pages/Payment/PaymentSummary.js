import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import {
  setCurrentStep,
  setDiscountCode,
  setOrderPrices,
  setPaymentData,
} from '../../features/checkout/checkoutSlice';
import { useCreatePaymentMutation } from '../../services/order';
import { fetchOrderPaymentCallback } from '../../services/orderPaymentCallback';
import { ErrorPage } from '../Error/ErrorPage';
import { OrderSummaryContainer } from '../Order/OrderSummaryContainer';
import { useDeleteCartMutation } from '../../services/cart';
import { localizedPath } from '../../helpers/localizedPath';

export const PaymentSummary = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentError, setIsPaymentError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
  const [createPayment] = useCreatePaymentMutation();
  const [deleteCart] = useDeleteCartMutation();

  const navigate = useNavigate();

  const retryPayment = () => {
    createPayment()
      .unwrap()
      .then((data) => {
        dispatch(
          setOrderPrices({
            summaryPrice: data.amount,
          }),
        );
        const code = data.usedDiscountCode || data.used_discount_code;
        if (code) {
          dispatch(setDiscountCode(code));
        }
        dispatch(setCurrentStep(2));
        dispatch(setPaymentData(data));
        navigate(localizedPath('/checkout'));
      })
      .catch((error) => {
        if (error.status === 422) {
          dispatch(setCurrentStep(1));
          navigate(localizedPath('/checkout'));
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('id');
    const paymentStatus = params.get('status');
    if (!paymentId) navigate(localizedPath('/404'));
    if (paymentStatus === 'failed') {
      setIsPaymentError(true);
      const errorMessage = params.get('message');
      if (errorMessage) {
        setPaymentErrorMessage(decodeURIComponent(errorMessage));
      }
      setIsLoading(false);
    } else {
      fetchOrderPaymentCallback(paymentId).then(() => {
        setShowOrderSummary(true);
        deleteCart();
      })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  if (isPaymentError && !showOrderSummary) {
    return (
      <ErrorPage
        title={t('order.errors.paymentFailed')}
        subtitle={t('order.errors.paymentFailedTryAgain')}
        message={paymentErrorMessage}
        buttonText={t('order.errors.tryAgain')}
        buttonAction={retryPayment}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (showOrderSummary) {
    return <OrderSummaryContainer type="new" />;
  }

  return null;
};
