import React from 'react';

import Visa from '../../assets/icons/visa-card.svg';
import Mastercard from '../../assets/icons/mastercard-card.svg';
import Placeholdercard from '../../assets/icons/placeholder-card.svg';
import STCPayIcon from '../../assets/icons/stc-pay.svg';
import { Text } from '../../components/Text/Text';

export const PaymentMethod = ({ paymentSource }) => {
  const paymentCardImage = (paymentMethod) => {
    switch (paymentMethod) {
      case 'visa':
        return <Visa />;
      case 'mastercard':
        return <Mastercard />;
      default:
        return <Placeholdercard />;
    }
  };

  if (paymentSource?.company === 'stcpay') {
    return (
      <div className="payment-method">
        <STCPayIcon />
        <Text type="body2">{paymentSource?.number}</Text>
      </div>
    );
  }

  return (
    <div className="payment-method">
      {paymentCardImage(paymentSource?.company)}
      <Text type="body2">{paymentSource?.number}</Text>
    </div>
  );
};
