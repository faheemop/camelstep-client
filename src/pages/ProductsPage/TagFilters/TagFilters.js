import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CustomCheckbox } from '../../../components/inputs/CustomCheckbox/CustomCheckbox';
import { setFilter, setFilterValues } from '../../../features/products/productsSlice';
import { useMediaQuery } from '../../../hooks/useCurrentScreenWidth';
import { useGetProductFiltersQuery } from '../../../services/products';
import './TagFilters.scss';

export const TagFilters = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const moreThan1024 = useMediaQuery('(min-width: 1024px)');
  const { data: productsFiltersData } = useGetProductFiltersQuery();
  const [filtersDataReady, setFiltersDataReady] = useState(false);
  const filterValues = useSelector((state) => state.products.filterValues);
  const canApplyFilters = useRef(!!moreThan1024);
  const tags = useRef([]);

  const mapApiDataTofiltersData = (data) => data.map((item, index) => ({
    id: index + 1,
    name: item.display_name,
    value: item.value,
    filterParams: {
      name: `filters[${item.filter_param}][]`,
      value: item.value,
    },
  }));

  const handleTagChange = (event, position) => {
    const updatedCheckedState = filterValues.tags.map((item, index) => (index === position ? !item : item));

    const filtersToApply = [];
    updatedCheckedState.forEach((item, index) => {
      if (!item) return;
      filtersToApply.push(tags.current.find((tag) => tag.id === index + 1).filterParams);
    });

    dispatch(
      setFilter({
        key: 'tags',
        value: filtersToApply,
      }),
    );

    dispatch(setFilterValues({ tags: updatedCheckedState }));
  };

  useEffect(() => {
    if (productsFiltersData) {
      const apiTags = mapApiDataTofiltersData([...productsFiltersData.tags]);
      // eslint-disable-next-line immutable/no-mutation
      tags.current = [...apiTags];
      setFiltersDataReady(true);
    }
  }, [productsFiltersData]);

  useEffect(() => {
    Object.assign(canApplyFilters, { current: !!moreThan1024 });
  }, [moreThan1024]);

  return (
    filtersDataReady && (
      <fieldset className="tag-filter-container">
        {tags.current.map((tag, index) => (
          <CustomCheckbox
            key={tag.id}
            name={tag.filterParams.name}
            label={t(`tags.${tag.name}`)}
            checked={filterValues.tags[index]}
            value={tag.filterParams.value}
            onChange={handleTagChange}
            index={index}
            id={`tag-filter${tag.id}`}
          />
        ))}
      </fieldset>
    )
  );
};
