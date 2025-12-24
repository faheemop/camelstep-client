import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../Text/Text';
import { OrderItem } from './OrderItem';

export const OrderSummaryList = ({ orderSummaryProducts, packageItems }) => {
  const { t } = useTranslation('application');

  const renderOrderItems = () => {
    const productItems = orderSummaryProducts?.map((item, i) => <OrderItem key={`${item.name}/${i}/vat`} item={item} />);
    const packageCartItems = packageItems?.map((item, i) => <OrderItem key={`${item.name}/${i}/vat`} item={item} />);

    return (
      <>
        {productItems}
        {packageCartItems}
      </>
    );
  };

  return (
    <div className="order-summary-list" key="vat">
      {!orderSummaryProducts?.length > 0 && !packageItems?.length > 0 ? (
        <Text style={{ margin: '3rem 0', textAlign: 'center' }} type="headline3">{t('checkout.empty')}</Text>
      ) : (
        renderOrderItems()
      )}
    </div>
  );
};
