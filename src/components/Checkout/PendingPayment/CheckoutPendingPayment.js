import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setCurrentStep } from '../../../features/checkout/checkoutSlice';
import { Button } from '../../common/Button/Button';
import { Text } from '../../Text/Text';

import './pendingPayment.scss';

export const CheckoutPendingPayment = () => {
  const { t } = useTranslation('application', { keyPrefix: 'order.pendingOrder' });
  const dispatch = useDispatch();

  const handleGoBackToPayment = () => {
    dispatch(setCurrentStep(2));
  };

  return (
    <div className="pending-payment">
      <Text className="pending-payment__msg" type="headline2">
        {t('heading')}
      </Text>
      <Text className="pending-payment__msg" type="headline3">
        {t('subHeading')}
      </Text>
      <Button type="primary" text={t('buttonText')} onClick={handleGoBackToPayment} />
    </div>
  );
};
