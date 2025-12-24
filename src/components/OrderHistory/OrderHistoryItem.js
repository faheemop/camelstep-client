import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Text } from '../Text/Text';
import { Button } from '../common/Button/Button';
import { OrderProduct } from '../Order/OrderProduct';

import './orderHistoryItem.scss';
import { RiyalSymbol } from '../RiyalSymbol/RiyalSymbol';
import { localizedPath } from '../../helpers/localizedPath';

export const OrderHistoryItem = ({ order }) => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();

  const handleNavigateToDetails = (orderId) => {
    navigate(localizedPath(`/profile_details/orders/${orderId}`));
  };

  const getOrderStatus = (order) => {
    const { state, order_type } = order;

    const statusMap = {
      delivery: {
        processing: 'order.statuses.ordered',
        new: 'order.statuses.ordered',
        approved: 'order.statuses.ordered',
        ready: 'order.statuses.ready',
        shipped: 'order.statuses.completed',
        completed: 'order.statuses.completed',
      },
      pickup: {
        ready_to_pickup: 'order.statuses.ordered',
        customer_picked_up: 'order.statuses.ready',
        completed: 'order.statuses.completed',
      },
    };

    const key = statusMap[order_type]?.[state];
    return key ? t(key) : null;
  };

  const statusText = getOrderStatus(order);

  return (
    <div className="order-history-item">
      <div className="order-history-item__content">
        <div className="order-history-item__head">
          <div className="order-history-item__head-info">
            <Text type="subtitle2">
              {t('profile.orders.orderNumber')}
              {' '}
              {order.unique_number}
            </Text>
            {statusText && (
              <Text type="subtitle2" className="order_status_badge">
                {statusText}
              </Text>
            )}
          </div>
          <Button type="naked" text={t('profile.orders.seeDetails')} onClick={() => handleNavigateToDetails(order.id)} />
        </div>
        <div className="order-history-item__body">
          <div className="order-history-item__details">
            <div className="order-history-item__details-item">
              <Text className="order-history-item__details-title" type="overline">
                {t('profile.orders.orderDate')}
              </Text>
              <div className="order-history-item__details-caption">
                <Text type="subtitle2">{order.order_date}</Text>
              </div>
            </div>
            <div className="order-history-item__details-item">
              <Text className="order-history-item__details-title" type="overline">
                {t('profile.orders.orderTotal')}
              </Text>
              <div className="order-history-item__details-caption">
                <Text type="subtitle2" className="text__rtl">
                  {order.total_price}
                  {' '}
                  <RiyalSymbol size={10} />
                </Text>
              </div>
            </div>
            <div className="order-history-item__details-item">
              <Text className="order-history-item__details-title" type="overline">
                {t('profile.orders.shipmentDate')}
              </Text>
              <div className="order-history-item__details-caption">
                <Text type="subtitle2">{order.shipment_date}</Text>
              </div>
            </div>
          </div>
          <div className="order-history-item__products">
            {order.products.map((product) => (
              <OrderProduct product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
