import React from 'react';
import { Text } from '../Text/Text';

import './orderTotalPrice.scss';

export const OrderTotalPrice = ({
  variant, totalLabel, totalPrice, bold,
}) => {
  if (variant === 'primary') {
    return (
      <div className="order-total">
        <Text style={{ fontWeight: bold ? 600 : 300 }} className="order-total__title" type="subtitle1">
          {totalLabel}
        </Text>
        <Text style={{ fontWeight: bold ? 600 : 300 }} className="order-total__price text__rtl" type="subtitle1">
          {totalPrice}
        </Text>
      </div>
    );
  }
  if (variant === 'secondary') {
    return (
      <div className="order-subtotal">
        <Text className="order-subtotal__title" type="subtitle2">
          {totalLabel}
        </Text>
        <Text className="order-subtotal__price text__rtl" type="subtitle2">
          {totalPrice}
        </Text>
      </div>
    );
  }
  if (variant === 'discount') {
    return (
      <div className="order-subtotal">
        <Text className="order-subtotal__title" type="subtitle2">
          {totalLabel}
        </Text>
        <Text className="order-subtotal__price--discount text__rtl" type="subtitle2">
          {totalPrice}
        </Text>
      </div>
    );
  }

  return null;
};
