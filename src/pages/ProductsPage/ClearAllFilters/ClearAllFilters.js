import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Text } from '../../../components/Text/Text';
import { resetFilterValues, resetFilters } from '../../../features/products/productsSlice';
import CrossIcon from '../../../assets/icons/x.svg';
import './ClearAllFilters.scss';

export const ClearAllFilters = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();

  const resetHandler = () => {
    dispatch(resetFilterValues());
    dispatch(resetFilters());
  };
  return (
    <button type="button" className="clear-all-filters-button" onClick={resetHandler}>
      <Text type="subtitle3" className="all-filters-label">
        {t('filtering.clearFilters')}
      </Text>
      <span className="cross-icon">
        <CrossIcon />
      </span>
    </button>
  );
};
