import React from 'react';
import { useTranslation } from 'react-i18next';

import './badge.scss';
import classNames from 'classnames';
import { transformName } from '../../../helpers/textHelpers';

export const Badge = ({ type }) => {
  const { t } = useTranslation('application');
  const transformedType = transformName(type);
  const badgeClasses = classNames({
    badge: true,
    'badge--new': transformedType === 'new',
    'badge--out-of-stock': transformedType === 'outofstock',
    'badge--limited': transformedType === 'limited',
    'badge--bestseller': transformedType === 'bestseller',
    'badge--exclusive': transformedType === 'exclusive',
  });

  return (
    <div className={badgeClasses}>
      <span>{t(`badge.${transformedType}`)}</span>
    </div>
  );
};
