import React from 'react';

import { useTranslation } from 'react-i18next';
import { OrderPackagesList } from '../../../components/Order/OrderPackage/OrderPackagesList';
import { Text } from '../../../components/Text/Text';

export const Delivery = ({ packages }) => {
  const { t } = useTranslation('application');

  return (
    <>
      <Text className="checkout-step__heading" type="headline3">
        {t('delivery.packages')}
      </Text>
      <OrderPackagesList packages={packages} />
    </>
  );
};
