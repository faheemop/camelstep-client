import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TagFilters } from '../TagFilters/TagFilters';
import { Text } from '../../../components/Text/Text';
import CrossIcon from '../../../assets/icons/x.svg';
import { PrimaryProductFilters } from '../PrimaryProductFilters/PrimaryProductFilters';
import { ToolsFilters } from '../CategoryFilters/ToolsFilters';
import './FilterModal.scss';

export const FilterModal = ({ setFilterModal }) => {
  const selectedCategory = useSelector((state) => state.products.mainCategory);
  const { t } = useTranslation('application');
  return (
    <div className="filter-modal">
      <div className="cross-icon-container">
        <button type="button" className="cross-icon" onClick={() => setFilterModal(false)}>
          <CrossIcon />
        </button>
      </div>
      <div className="filters-container">
        {/* <div className="tag-filters">
          <Text className="tag-filters-label" type="body2">
            {t('filtering.featured')}
          </Text>
          <TagFilters />
        </div> */}
        {(selectedCategory === 'All' || selectedCategory === 'Coffee')
          && <PrimaryProductFilters tagFilterSelect />}
        {(selectedCategory === 'Tools')
          && <ToolsFilters />}
      </div>
    </div>
  );
};
