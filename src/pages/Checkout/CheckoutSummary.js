import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Text } from '../../components/Text/Text';
import { useGetCartPackagesQuery, useGetCartProductsQuery } from '../../services/cart';
import { OrderSummaryList } from '../../components/Order/OrderSummaryList';
import { CheckoutActionButton } from '../../components/Checkout/CheckoutActionButton';
import { SendAsPresentContainer } from './SendAsPresent/SendAsPresentContainer';
import { CheckoutGiftCode } from './CheckoutGiftCode/CheckoutGiftCode';
import { OrderTotals } from './OrderTotals';

export const CheckoutSummary = () => {
  const { t } = useTranslation('application');
  const currentStep = useSelector((state) => state.checkout.currentStep);
  const { data } = useGetCartProductsQuery();
  const { data: packageItems } = useGetCartPackagesQuery();
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);

  return (
    <>
      <Text type="subtitle2">{t('order.summary')}</Text>
      <OrderSummaryList orderSummaryProducts={data?.records} packageItems={packageItems?.records} />
      <hr style={{ margin: '2rem 0', border: '1px solid #E2E0DB' }} />
      {currentStep === 2 && <CheckoutGiftCode />}
      {shipmentOption !== 'pickup' && (
        <SendAsPresentContainer />
      )}
      <OrderTotals />
      <CheckoutActionButton />
    </>
  );
};
