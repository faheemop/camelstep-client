import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/Text/Text';
import './AllFilters.scss';
import FiltersIcon from '../../../assets/icons/filters-2.svg';

export const AllFilters = ({ setFilterModal }) => {
  const { t } = useTranslation('application');
  return (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="all-filters-button" onClick={() => setFilterModal((prev) => !prev)}>
      <Text type="subtitle3" className="all-filters-label">
        {t('filtering.allFilters')}
      </Text>
      <FiltersIcon />
    </div>
  );
};
