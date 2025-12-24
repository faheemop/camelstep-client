import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductImage } from '../ProductImage/ProductImage';
import { ProductPreview } from '../ProductPreview/ProductPreview';
import { Text } from '../Text/Text';

import './packageSummaryItem.scss';
import { RiyalSymbol } from '../RiyalSymbol/RiyalSymbol';

export const PackageSummaryItem = ({
  name_ar, name_en, image_url, quantity, totalQuantityPrice, vatPrice, package_products,
}) => {
  const { t } = useTranslation('application');
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const name = currentLanguage === 'ar' ? name_ar : name_en;

  return (
    <div className="summary-item" id="item">
      <div className="summary-item__container">
        <div className="summary-item__product-view">
          <ProductPreview productImage={image_url} productCount={parseInt(quantity, 10)} />
        </div>

        <div>
          <div className="summary-item__product-info">
            <Text className="summary-item__name" type="headline2">
              {name}
            </Text>
            <Text className="summary-item__price text__rtl" type="body2">
              {(parseFloat(totalQuantityPrice) + (vatPrice ? (parseFloat(vatPrice) * parseFloat(quantity)) : 0)).toFixed(2)}
              {' '}
              <RiyalSymbol size={9} />
            </Text>
            { vatPrice
              && (
              <Text className="summary-item" type="body3">
                {t('products.product.vatIncluded')}
              </Text>
              )}
          </div>
        </div>
      </div>
      {/* List Products included in a Package */}
      {package_products?.length && (
        <div className="summary-item__package-products-container">
          {package_products?.map((package_product, index) => (
            <div key={index}>
              <div className="summary-item__package-product">
                <ProductImage
                  source={package_product?.product?.image_url}
                  className="summary-item__product-image"
                  alt="order-product"
                />
                <h4>{package_product?.product?.name}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
