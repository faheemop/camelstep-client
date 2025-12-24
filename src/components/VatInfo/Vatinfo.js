import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../Text/Text';
import InfoIcon from '../../assets/icons/info-icon.svg';

import './vatinfo.scss';

export const Vatinfo = () => {
  const { t } = useTranslation('application');
  return (
    <div className="vat-info">
      <Text className="vat-info__heading" type="subtitle1">
        <InfoIcon />
        <span>{t('vatInfo.heading')}</span>
      </Text>
      <Text type="body1">
        {t('vatInfo.content')}
      </Text>
    </div>
  );
};
