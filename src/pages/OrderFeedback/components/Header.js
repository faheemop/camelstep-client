import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '../../../components/Text/Text';

export const Header = ({ orderId }) => {
  const [t] = useTranslation('application');

  return (
    <>
      <Text
        className="order-feedback-page__greeting"
        type="body1"
      >
        {t('orderFeedback.headline')}
      </Text>
      <Text type="body1">{t('orderFeedback.body', { orderId })}</Text>
    </>
  );
};
