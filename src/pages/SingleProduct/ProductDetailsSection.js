import React from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/Text/Text';
import { capitalizeFirstLetter, transformName } from '../../helpers/textHelpers';

export const ProductDetailsSection = ({ productDetails, customProperties }) => {
  const { t } = useTranslation('application');

  const formatValue = (option) => {
    const { name, value } = option;
    const isCountry = name?.toLowerCase() === 'country' || name === 'الدولة';
    if (Array.isArray(value)) {
      return value.map((opt) => t(`tastes.${transformName(opt)}`)).join(', ');
    }
    return isCountry ? capitalizeFirstLetter(value) : t(`${name}.${transformName(value)}`);
  };

  const anyProductDetailsExists = productDetails.length > 0;
  const anyCustomPropertiesExists = customProperties.length > 0;

  if (anyProductDetailsExists || anyCustomPropertiesExists) {
    return (
      <Row>
        <Col sm={12} md={6} lg={3.5}>
          <div style={{ marginTop: 'auto' }}>
            <Text type="headline2">{t('products.product.details')}</Text>
            <table className="product-details-table">
              <tbody>
                {productDetails.map((detail) => (
                  <tr key={detail.name}>
                    <td>
                      <Text type="body2">{detail.name}</Text>
                    </td>
                    <td data-type={detail.name}>
                      <Text type="body2">{formatValue(detail)}</Text>
                    </td>
                  </tr>
                ))}
                {customProperties.map((property) => (
                  <tr key={property.name}>
                    <td>
                      <Text type="body2">{property.name}</Text>
                    </td>
                    <td>
                      <Text type="body2" data-type={property.name}>{property.value}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    );
  }
  return null;
};
