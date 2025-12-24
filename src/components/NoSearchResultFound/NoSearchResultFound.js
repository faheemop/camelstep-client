import React from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { Text } from '../Text/Text';

import './NoSearchResultFound.scss';

export const NoSearchResultFound = () => {
  const { t } = useTranslation('application');
  return (
    <div className="no-results">
      <SvgIcon
        id="icon-coffee-pot"
        width={26}
        height={32}
        className="no-results__icon"
      />
      <Text type="headline3" style={{ marginTop: '1rem' }} className="no-results__text">
        {t('common.noResults')}
      </Text>
    </div>
  );
};
