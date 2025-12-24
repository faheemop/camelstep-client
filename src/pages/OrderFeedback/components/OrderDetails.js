import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '../../../components/Text/Text';
import { Expandable } from '../../../components/common/Expandable/Expandable';

export const OrderDetails = ({ orderId, orderPorducts }) => {
  const [t] = useTranslation('application');

  return (
    <div className="order-feedback-page__order">
      <Text type="subtitle1" className="order-feedback-page__order_id">
        {t('orderFeedback.order')}
        {' '}
        {orderId}
      </Text>
      <Expandable label="See details" variant="accordion">
        <div className="order-feedback-page__order-details">
          {orderPorducts.map((product) => (
            <p className="order-feedback-page__order-details-item" key={product.name}>
              {`${product.quantity}x ${product.name}`}
            </p>
          ))}
        </div>
      </Expandable>
    </div>
  );
};
