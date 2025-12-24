import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button/Button';
import { openTasteWheelModal } from './TasteWheel';
import { setFilter, setFilterValues } from '../../features/products/productsSlice';

export const TasteWheelButton = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();

  const tasteFilterValues = useSelector((state) => state.products.filterValues.taste);

  const TasteWheelFilterData = {
    majorNote: 'filters[properties][major_note]',
    flavor: 'filters[properties][flavour]',
    minorNote: 'filters[properties][minor_note]',
  };

  const formatTasteToFilterValue = (taste) => {
    if (taste.name.includes('/')) {
      return taste.name.replace(/ /g, '');
    }
    return taste.name.replace(/ /g, '_');
  };

  const handleTasteFilterUpdate = (data) => {
    const filterParams = [];
    Object.keys(data).forEach((key) => {
      if (data[key].name !== 'none') {
        filterParams.push({
          name: TasteWheelFilterData[key],
          value: formatTasteToFilterValue(data[key]),
        });
      }
    });

    Object.keys(data).forEach((key) => {
      if (data[key].name !== 'none') {
        dispatch(
          setFilter({
            key: 'taste',
            value: filterParams,
          }),
        );
      }
    });

    dispatch(setFilterValues({ taste: data }));
  };

  return (
    <Button
      type="tertiary"
      text={t('filtering.tasteWheel')}
      onClick={() => openTasteWheelModal({ title: t('tasteWheel.title'), handleStateSubmit: handleTasteFilterUpdate, currentState: tasteFilterValues })}
    />
  );
};
