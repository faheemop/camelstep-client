import React from 'react';

import { useTranslation } from 'react-i18next';
import { Text } from '../../Text/Text';
import { PackageProductsList } from './PackageProductsList';

import './orderPackage.scss';
import { OrderProduct } from '../OrderProduct';
import { RiyalSymbol } from '../../RiyalSymbol/RiyalSymbol';

export const OrderPackage = ({ box, index }) => {
  const { t } = useTranslation('application');

  const getDeliveryPrice = (data) => parseFloat(data.delivery_price, 10) || 0;

  const getTotalPrice = (data) => {
    // Package/bundle has its total_quantity_price
    // and is not calculated based on the products that a bundle includes.
    // Bundle is one added to cart while shopping from packages page.
    const bundlePackagePrice = data?.total_quantity_price;
    if (bundlePackagePrice) return parseFloat(bundlePackagePrice, 10);

    return (
      data.products
        .map((product) => {
          const priceMod = product?.vat_price
            ? +parseFloat(product?.vat_price || 0, 10).toFixed(2)
            : 0;
          return priceMod + parseFloat(product.total_quantity_price, 10);
        })
        .reduce((sum, price) => sum + price) || 0
    );
  };

  const getSummaryPrice = (data) => getTotalPrice(data) + getDeliveryPrice(data);

  const calcPackageIndex = (packageIndex) => packageIndex + 1;

  return (
    <div key={`${box.id}`} className="package">
      <div className="package-heading">
        <Text className="package-index" type="subtitle1">{t('delivery.packageLabel', { index: calcPackageIndex(index) })}</Text>
      </div>
      {/* Show image and quentity count bundle directly */}
      {box?.quantity && (
        <div style={{ marginBottom: 10 }}>
          <OrderProduct product={box} />
        </div>
      )}
      <div className="package-summary">
        <div>
          <Text type="body2">{t('delivery.itemsPrice').toLocaleUpperCase()}</Text>
          <span className="text__rtl">
            {`${getTotalPrice(box).toFixed(2)}`}
            {' '}
            <RiyalSymbol size={10} />
          </span>
        </div>
        <div>
          <Text type="body2">{t('delivery.deliveryPrice').toLocaleUpperCase()}</Text>
          <span className="text__rtl">
            {`${getDeliveryPrice(box).toFixed(2)}`}
            {' '}
            <RiyalSymbol size={10} />
          </span>
        </div>
        <div>
          <Text type="body2">{t('delivery.totalPrice').toLocaleUpperCase()}</Text>
          <span className="text__rtl">
            {`${getSummaryPrice(box).toFixed(2)}`}
            {' '}
            <RiyalSymbol size={10} />
          </span>
        </div>
      </div>
      <PackageProductsList products={box.products} />
    </div>
  );
};
