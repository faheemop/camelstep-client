import React from 'react';
import { useTranslation } from 'react-i18next';
import PreferenceProduct from '../../assets/images/preferenceProduct.png';
import { transformName } from '../../helpers/textHelpers';
import { Text } from '../Text/Text';

import './preferenceItem.scss';

export const PreferenceItem = ({ preference }) => {
  const { t } = useTranslation('application');
  const { name, value } = preference;
  const type = ['major_note', 'minor_note'].includes(name) ? 'tastes' : name;
  return (
    <div className="product-preference-item">
      {/* TODO: image to be swapped when client provides it */}
      <img src={PreferenceProduct} alt="preference-product" />
      <Text className={`product-preference-item__title ${type}`} type="body2">
        {/* eslint-disable-next-line no-nested-ternary */}
        {transformName(name) !== 'noofcups' ? t(`${transformName(type)}.${transformName(value)}`) : (+value > 0 ? value : t('common.other'))}
      </Text>
    </div>
  );
};
