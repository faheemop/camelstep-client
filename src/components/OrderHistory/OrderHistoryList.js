import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../Text/Text';
import { OrderHistoryItem } from './OrderHistoryItem';

import './ordersHistory.scss';

export const OrderHistoryList = ({ orders }) => {
  const { t } = useTranslation('application');

  return (
    <div className="orders-history">
      {orders?.length === 0 ? (
        <Text type="headline3">{t('profile.orders.noOrders')}</Text>
      ) : (
        orders?.map((order, index) => <OrderHistoryItem key={index} order={order} />)
      )}
    </div>
  );
};
