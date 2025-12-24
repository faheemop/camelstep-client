import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderSummaryList } from '../../components/Order/OrderSummaryList';
import { Text } from '../../components/Text/Text';

import './orderPackages.scss';
import { RiyalSymbol } from '../../components/RiyalSymbol/RiyalSymbol';

export const OrderPackages = ({ orderPackages }) => {
  const { t } = useTranslation('application');

  const packageShipmentStatus = (orderPackage) => {
    if (!orderPackage.external_service_name) {
      return (
        <Text className="order-package__courier-name" type="body2">
          {t('order.packagePrepare')}
        </Text>
      );
    }

    if (orderPackage.external_service_name === 'pickup') {
      return (
        <Text className="order-package__courier-name" type="body2">
          {t('delivery.pickup')}
        </Text>
      );
    }

    return (
      <>
        <Text className="order-package__courier-name" type="body2">
          {orderPackage.external_service_name}
        </Text>
        <Text className="order-package__number" type="body2">
          {orderPackage.tracking_number}
        </Text>
      </>
    );
  };

  return orderPackages.map((thePackage, index) => (
    <div key={index}>
      <div className="order-package-bar">
        <div className="order-package-info">{packageShipmentStatus(thePackage)}</div>
        <Text type="body2" className="text__rtl">
          {thePackage.total_quantity_price || thePackage.total_price}
          {' '}
          <RiyalSymbol size={10} />
        </Text>
      </div>
      <OrderSummaryList orderSummaryProducts={thePackage?.bundle ? [thePackage?.bundle] : thePackage?.products} />
    </div>
  ));
};
