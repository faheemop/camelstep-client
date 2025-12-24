import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { CustomSelect } from '../../../components/inputs/CustomSelect/CustomSelect';
import { sortByOptions } from '../filtersData';
import {
  setFilter, setFilterValues, setTaste,
} from '../../../features/products/productsSlice';

export const SortByFilters = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const filterValues = useSelector((state) => state.products.filterValues);

  const setFilterValue = (value, el, option) => {
    const { name } = el;

    if (name === 'taste') {
      dispatch(
        setTaste({
          majorNote: {
            name: option.name,
            translationName: option.translationName,
          },
        }),
      );
    } else {
      dispatch(setFilterValues({ [name]: value }));
    }
  };

  const externalHandler = (option, source) => {
    const urlParams = new URLSearchParams();
    option.filterParams.forEach((param) => urlParams.append(param.name, param.value));

    dispatch(setFilter({
      key: source,
      value: option.filterParams,
    }));
  };

  return (
    <CustomSelect
      subLabel={`${_.capitalize(t('sorting.sortBy'))}:`}
      inputName="sortBy"
      value={filterValues.sortBy}
      options={sortByOptions}
      setValue={setFilterValue}
      externalHandler={externalHandler}
    />
  );
};
