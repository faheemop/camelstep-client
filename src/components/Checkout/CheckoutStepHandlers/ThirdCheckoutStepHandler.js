import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  prevCheckoutStep, setPendingPayment, setDiscountCode,
} from '../../../features/checkout/checkoutSlice';
import { Button } from '../../common/Button/Button';

import { useUnlockCartMutation } from '../../../services/cart';

export const ThirdCheckoutStepHandler = () => {
  const { t } = useTranslation('application');
  const [unlockCart] = useUnlockCartMutation();

  const dispatch = useDispatch();

  const handleBackAction = () => {
    dispatch(prevCheckoutStep());
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    unlockCart();
  };

  return (
    <Button
      type="primary"
      inverted
      buttonType="button"
      text={t('common.back')}
      onClick={handleBackAction}
    />
  );
};
