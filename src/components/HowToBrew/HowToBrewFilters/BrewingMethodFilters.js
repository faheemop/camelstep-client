import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { matchPath, useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  setActiveFilter,
  setBaristaMode,
  setBreingwMethodValues,
  setFilteredBrewingMethods,
} from '../../../features/howToBrew/howToBrewSlice';
import { useGetProductRecipeQuery } from '../../../services/products';
import { useGetSpecificRecipeQuery } from '../../../services/howToBrew';

import { Text } from '../../Text/Text';
import { capitalizeFirstLetter } from '../../../helpers/textHelpers';
import { RadioButtonInput } from '../../inputs/radioButton/RadioButtonInput';
import { localizedPath } from '../../../helpers/localizedPath';

export const BrewingMethodFilters = () => {
  const { t } = useTranslation('application');
  const allBrewingMethods = useSelector((state) => state.howToBrew.filters);
  const brewingMethods = useSelector((state) => state.howToBrew.filteredBrewingMethods);
  const activeFilter = useSelector((state) => state.howToBrew.activeFilter);
  const baristaModeEnabled = useSelector((state) => state.howToBrew.baristaModeEnabled);
  const tasteWheelMajorNote = useSelector((state) => state.howToBrew.tasteWheelMajorNote);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [skip, setSkip] = useState(true);

  const { data } = useGetProductRecipeQuery(productId ?? skipToken);
  const { data: specificRecipeData } = useGetSpecificRecipeQuery(activeFilter, { skip });

  useEffect(() => {
    if (!productId) {
      if (activeFilter !== null) {
        setSkip(false);
      }
    } else {
      setSkip(true);
      if (data) {
        const howToBrewId = data.id;
        dispatch(setActiveFilter(howToBrewId));
      }
    }
  }, [productId, activeFilter]);

  useEffect(() => {
    if (!productId) {
      if (specificRecipeData) {
        dispatch(setBreingwMethodValues(specificRecipeData));
      }
    } else if (data) {
      const howToBrewId = data.id;
      dispatch(setActiveFilter(howToBrewId));
    }
  }, [specificRecipeData, data]);

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    dispatch(setActiveFilter(parseInt(value, 10)));

    const match = matchPath(
      {
        path: '/how_to_brew/:productId',
        exact: true,
        strict: false,
      },
      window.location.pathname,
    );

    if (match !== null) navigate(localizedPath('/how_to_brew'));
  };

  useEffect(() => {
    if (baristaModeEnabled) dispatch(setBaristaMode(false));
  }, [activeFilter]);

  useEffect(() => {
    const isDefaultTaste = tasteWheelMajorNote?.majorNote?.name === 'none';
    if (!isDefaultTaste) {
      const filteredBrewingMethods = allBrewingMethods.filter((brewingMethod) => brewingMethod.major_notes.includes(tasteWheelMajorNote.majorNote.name.replace(' / ', '/')));
      dispatch(setFilteredBrewingMethods(filteredBrewingMethods));
    }
    if (isDefaultTaste) {
      dispatch(setFilteredBrewingMethods(allBrewingMethods));
    }
  }, [tasteWheelMajorNote]);

  return (
    <>
      <Text type="caption" className="brewing-method__caption">
        {capitalizeFirstLetter(t('common.brewingMethod'))}
      </Text>
      <div
        style={{
          display: 'inline-flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '1rem',
        }}
      >
        {brewingMethods
          && brewingMethods.map((filter) => (
            <RadioButtonInput
              key={filter.id}
              type="radio"
              text={filter.name}
              value={filter.id}
              currentValue={activeFilter}
              name="brewingMethod"
              id={`${filter.name}${filter.id}`}
              onChange={handleCheckboxChange}
              checked={false}
            />
          ))}
      </div>
    </>
  );
};
