import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Collapse } from 'react-collapse';
import { MainCategoryFilters } from '../MainCategoryFilters/MainCategoryFilters';
import { SortByFilters } from '../SortByFilters/SortByFilters';
import { AllFilters } from '../AllFilters/AllFilters';
import { FilterModal } from '../FilterModal/FilterModal';
import { TasteWheelButton } from '../../../components/TasteWheel/TasteWheelButton';
import { ClearAllFilters } from '../ClearAllFilters/ClearAllFilters';
import './ProductsFiltersSection.scss';

export const ProductsFiltersSection = () => {
  const [filterModal, setFilterModal] = useState(false);
  const areFilterApplied = useSelector((state) => state.products.filterApplied);

  return (
    <div className="product-filters-container" id="products-list">
      <div className="products-filters">
        {/* <div>
          <MainCategoryFilters />
        </div> */}
        <div className="sort-filters">
          {/* <div>
            <TasteWheelButton />
          </div> */}
          <div className="left-container">
            {areFilterApplied && <ClearAllFilters />}
            <AllFilters setFilterModal={setFilterModal} />
            {/* <SortByFilters /> */}
          </div>
        </div>
      </div>
      <Collapse isOpened={filterModal} transitionTime={300}>
        <FilterModal setFilterModal={setFilterModal} />
      </Collapse>
    </div>
  );
};
