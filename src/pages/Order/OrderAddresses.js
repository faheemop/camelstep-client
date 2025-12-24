import React from 'react';
import { Col } from 'react-grid-system';
import { useTranslation } from 'react-i18next';

import { capitalizeFirstLetter } from '../../helpers/textHelpers';
import { AddressDisplay } from '../../components/Addresses/AddressDisplay';
import { Text } from '../../components/Text/Text';

const mapPickupAddress = ({
  city, country, street, street2, zip,
}) => ({
  address_line_1: street,
  address_line_2: street2,
  zipcode: zip,
  city,
  country,
});

export const OrderAddresses = ({ order }) => {
  const { t } = useTranslation('application');

  const pickupLocation = order.packages?.length
    ? order.packages[0]?.location
    : order.bundle_packages[0]?.bundle?.pickup_stores_list[0];

  return (
    <>
      <Col lg={6} md={6} sm={12}>
        {order.order_type === 'pickup'
          ? (
            <>
              <Text type="subtitle1" style={{ marginBottom: '1rem' }}>
                {capitalizeFirstLetter(t('checkout.pickupAddress'))}
              </Text>
              <AddressDisplay address={mapPickupAddress(pickupLocation)} />
            </>
          )
          : (
            <>
              <Text type="subtitle1" style={{ marginBottom: '1rem' }}>
                {capitalizeFirstLetter(t('checkout.shippingAddress'))}
              </Text>
              <AddressDisplay address={order.shipping_address} />
            </>
          )}
      </Col>
      <Col lg={6} md={6} sm={12}>
        <Text type="subtitle1" style={{ marginBottom: '1rem' }}>
          {capitalizeFirstLetter(t('checkout.billingAddress'))}
        </Text>
        <AddressDisplay address={order.billing_address} />
      </Col>
    </>
  );
};
