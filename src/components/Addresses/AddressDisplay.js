import React from 'react';
import { Text } from '../Text/Text';

export const AddressDisplay = ({ address }) => (
  <div>
    <Text type="body2" style={{ marginBottom: '0.5rem' }}>
      {address?.full_name}
    </Text>
    <Text type="body2" style={{ marginBottom: '0.5rem' }}>
      {address?.address_line_1}
      {' '}
      {address?.address_line_2}
    </Text>
    <Text type="body2" style={{ marginBottom: '0.5rem' }}>
      {address?.phone}
    </Text>
    <Text type="body2" style={{ marginBottom: '0.5rem' }}>
      {address?.city}
      {' '}
      {address?.zipcode}
    </Text>
    <Text type="body2" style={{ marginBottom: '0.5rem' }}>
      {address?.country}
    </Text>
  </div>
);
