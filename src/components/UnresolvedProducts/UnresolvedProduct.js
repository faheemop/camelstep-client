import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductBadges } from '../Product/ProductBadges';

import { ProductCountBadge } from '../ProductCountBadge/ProductCountBadge';
import { ProductImage } from '../ProductImage/ProductImage';
import { Text } from '../Text/Text';

import './unresolvedProduct.scss';
import { RiyalSymbol } from '../RiyalSymbol/RiyalSymbol';

export const UnresolvedProduct = ({ item }) => {
  const { t } = useTranslation('application');

  return (
    <>
      <div className="unresolved-product" id="item">
        <div className="unresolved-product__container">
          <div className="unresolved-product__product-view">
            <div className="product-preview">
              <ProductImage source={item.image_url} alt={item.name} className="product-preview__image" />
            </div>
            <div className="unresolved-product__remove">
              <ProductCountBadge count={item.desired_quantity} />
              {item.tags?.length > 0 && <ProductBadges badges={item.tags} />}
              <Text className="unresolved-product__remove-text" type="body2">
                {`${item.desired_quantity > 1 ? t('common.items') : t('common.item')} ${t('unresolvedProducts.itemsRemoved')}`}
              </Text>
            </div>
          </div>
          <div>
            <div className="unresolved-product__product-info">
              <Text className="unresolved-product__name" type="headline2">
                {item.name}
              </Text>
              <Text className="unresolved-product__price text__rtl" type="body2">
                {item.total_quantity_price}
                {' '}
                <RiyalSymbol size={10} />
              </Text>
            </div>
          </div>
        </div>
      </div>
      <hr className="unresolved-product__divider" />
    </>
  );
};
