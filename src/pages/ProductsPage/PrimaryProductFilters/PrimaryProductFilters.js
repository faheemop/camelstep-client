import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CustomSelect } from '../../../components/inputs/CustomSelect/CustomSelect';
import {
  setFilter, setFilterValues, setTaste,
} from '../../../features/products/productsSlice';
import { useGetProductFiltersQuery } from '../../../services/products';
import { useGetBrewingMethodsQuery } from '../../../services/brewingMethods';
import {
  major_notes, countriesFilters, brewing_methods,
} from '../filtersData';
import './PrimaryProductFilters.scss';

export const PrimaryProductFilters = ({ tagFilterSelect }) => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const { data: brewingMethodFiltersData } = useGetBrewingMethodsQuery();
  const { data: productsFiltersData } = useGetProductFiltersQuery();
  const [, setFiltersDataReady] = useState(false);
  const filterValues = useSelector((state) => state.products.filterValues);
  // console.log("filterrrrrrrr", filterValues.country)
  const countries = useRef([...countriesFilters]);
  const brewingMethods = useRef([...brewing_methods]);

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
      // console.log("elseeeee", name, "value", value)
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

  useEffect(() => {
    // const data = productsFiltersData && brewingMethodFiltersData
    // console.log("dataaaa", data)
    if (productsFiltersData && brewingMethodFiltersData) {
      setFiltersDataReady(true);
    }
  }, [productsFiltersData, brewingMethodFiltersData]);

  return (
    <div className={`${!tagFilterSelect ? 'primary-filter-container' : 'coffee-filters-container'}`}>
      <CustomSelect
        label={t('common.brewingMethod').toLocaleUpperCase()}
        inputName="brewing_method"
        value={filterValues.brewing_method}
        options={brewingMethods.current}
        setValue={setFilterValue}
        externalHandler={externalHandler}
        tagFilterSelect={tagFilterSelect}
      />
      <CustomSelect
        label={t('common.country').toLocaleUpperCase()}
        inputName="country"
        value={filterValues.country}
        options={countries.current}
        setValue={setFilterValue}
        externalHandler={externalHandler}
        tagFilterSelect={tagFilterSelect}
      />
      <CustomSelect
        label={t('common.majorNote').toLocaleUpperCase()}
        inputName="taste"
        value={filterValues.taste.majorNote.name}
        options={major_notes}
        setValue={(value, el, option) => {
        console.log('setvalues', value, el, option)
        setFilterValue(value, el, option)}}
        externalHandler={externalHandler}
        tagFilterSelect={tagFilterSelect}
      />
    </div>
  );
};
