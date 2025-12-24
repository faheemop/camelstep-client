import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setMainCategory } from '../../../features/products/productsSlice';
import { capitalizeFirstLetter } from '../../../helpers/textHelpers';

import './MainCategoryFilters.scss';

const mainCategoryFiltersData = [
  {
    id: 1,
    key: 'all',
    checkboxId: 'product-filter-all',
  },
  {
    id: 2,
    key: 'coffee',
    checkboxId: 'product-filter-coffee',
  },
  {
    id: 3,
    key: 'tools',
    checkboxId: 'product-filter-tools',
  },
  {
    id: 4,
    key: 'packages',
    checkboxId: 'product-filter-package',
  },
  {
    id: 5,
    key: 'spareParts',
    checkboxId: 'product-filter-spare-parts',
  },
];

export const MainCategoryFilters = () => {
  const { t } = useTranslation('application');
  const mainCategory = useSelector((state) => state.products.mainCategory);
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState(mainCategoryFiltersData[1]);

  const handleMainCategoryChange = (filter) => {
    if (filter.key !== mainCategory) {
      dispatch(setMainCategory(capitalizeFirstLetter(filter.key)));
      setSelectedFilter(filter);
    }
  };

  return (
    <div
      className="main-category-filters-container"
    >
      {mainCategoryFiltersData.map((filter) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <p
          className={`main-filter-option ${selectedFilter === filter && 'selected'}`}
          key={filter.id}
          onClick={() => handleMainCategoryChange(filter)}
        >
          {capitalizeFirstLetter(t(`common.${filter.key}`))}
        </p>
      ))}
    </div>
  );
};
