import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/Text/Text';
import { ProductImage } from '../../components/ProductImage/ProductImage';
import { RiyalSymbol } from '../../components/RiyalSymbol/RiyalSymbol';
import { localizedPath } from '../../helpers/localizedPath';

export const PackageProducts = ({ packageData }) => {
  const { t } = useTranslation('application', { keyPrefix: 'products.product' });

  const { package_products } = packageData || {};

  if (package_products?.length > 0) {
    return (
      <Row style={{ paddingBottom: '10vmin' }}>
        <Col sm={12}>
          <Text type="headline2">{t('includedProducts')}</Text>
          <div className="package-included-products-container">
            {package_products.map((package_product, index) => (
              <div key={index} className="package-included-products-item">
                <Link to={localizedPath(`/products/${package_product.product.id}`)} className="other-stuff-item">
                  <ProductImage source={package_product.product.image_url} alt="product you might need" className="other-stuff-item__image" />
                  <div className="other-stuff-item__content">
                    <Text type="body1" className="other-stuff-item__name">
                      {package_product.product.name}
                    </Text>
                    <Text type="body1" className="other-stuff-item__price">
                      {package_product.list_price}
                      {' '}
                      <RiyalSymbol size={14} />
                    </Text>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    );
  }
  return null;
};
