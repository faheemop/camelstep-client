import React from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/Text/Text';

export const SingleProductDetailsSection = ({ data }) => {
  const { t } = useTranslation('application');

  if (data.length > 0) {
    return (
      <Row style={{ paddingBottom: '30vmin' }}>
        <Col sm={12} md={6} lg={3.5}>
          <div style={{ marginTop: 'auto' }}>
            <Text type="headline2">{t('products.product.details')}</Text>
            <table className="product-details-table">
              <tbody>
                {data.map((detail, index) => (
                  <tr key={index}>
                    <td>
                      <Text type="body2">{detail.name}</Text>
                    </td>
                    <td>
                      <Text type="body2">{detail.value}</Text>
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
