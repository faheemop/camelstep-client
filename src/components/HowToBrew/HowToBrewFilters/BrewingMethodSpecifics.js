import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Text } from '../../Text/Text';
import { setBrewingMethodDetailedValues } from '../../../features/howToBrew/howToBrewSlice';
import { CustomDropdown } from '../../CustomDropdown/CustomDropdown';

import './brewingMethodSpecifics.scss';

export const BrewingMethodSpecifics = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();

  const baristaModeEnabled = useSelector((state) => state.howToBrew.baristaModeEnabled);
  const brewingMethodDetailedValues = useSelector((state) => state.howToBrew.brewingMethodDetailedValues);
  const numberOfCups = useSelector((state) => state.howToBrew.numberOfCups);
  const waterAmount = useSelector((state) => state.howToBrew.brewingMethodDetailedValues.waterAmount);
  const ratio = useSelector((state) => state.howToBrew.brewingMethodDetailedValues.ratio);
  const grams = useSelector((state) => state.howToBrew.brewingMethodDetailedValues.grams);
  const defaultRatio = useSelector((state) => state.howToBrew.default_ratio);
  const alternateRatios = useSelector((state) => state.howToBrew.alternate_ratios);
  const maxWaterInTool = useSelector((state) => state.howToBrew.maxWaterInTool);

  const [maxGramsValue, setMaxGramsValue] = useState(0);
  const [maxWaterValue, setMaxWaterValue] = useState(0);

  const ratioOptions = [defaultRatio, ...alternateRatios];

  const [errors, setErrors] = useState({});

  const [focused, setFocused] = useState('');

  const onFocus = (e) => {
    setFocused(e.target.id || e.target.name);
  };

  const onBlur = () => {
    setFocused('');
  };

  useEffect(() => {
    setMaxWaterValue(maxWaterInTool);
    const maxGrams = Number.parseFloat(maxWaterInTool / ratio)
      .toFixed(2)
      .replace(/[.,]00$/, '');

    setMaxGramsValue(maxGrams);
  }, [maxWaterInTool]);

  const brewingMethodSpecifics = [
    {
      id: 'grams',
      editable: true,
      value: brewingMethodDetailedValues.grams,
      unit: 'g',
    },
    {
      id: 'temperature',
      value: brewingMethodDetailedValues.temperature,
      unit: '°C',
    },
    {
      id: 'waterAmount',
      editable: true,
      value: brewingMethodDetailedValues.waterAmount,
      unit: 'ml',
    },
    {
      id: 'ratio',
      editable: true,
      value: brewingMethodDetailedValues.ratio,
      unit: ': 1',
      type: 'select',
    },
  ];

  const validateField = (fieldName, value, name) => {
    const format = /^[0-9]*\.?[0-9]*$/;
    const isInCorrectFormat = format.test(value);

    switch (fieldName) {
      case 'waterAmount': {
        if (value.length === 0) {
          setErrors({ ...errors, waterAmount: t('howToBrew.validation.notEmpty', { name }) });
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value }));
        } else if (Number.parseFloat(value) > Number.parseFloat(maxWaterValue)) {
          setErrors({ ...errors, waterAmount: t('howToBrew.validation.lessThan', { name, limit: maxWaterValue }) });
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value: maxWaterValue }));
        } else if (!isInCorrectFormat) {
          setErrors({ ...errors, waterAmount: t('howToBrew.validation.number', { name }) });
        } else {
          setErrors({ ...errors, waterAmount: '' });
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value }));
        }
        break;
      }
      case 'grams': {
        const isGramsValidLength = value.length < 7;

        if (!isGramsValidLength) {
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value: parseFloat(value.substring(0, 6)) }));
        } else if (value.length === 0) {
          setErrors({ ...errors, grams: t('howToBrew.validation.notEmpty', { name }) });
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value: '' }));
        } else if (!isInCorrectFormat) {
          setErrors({ ...errors, grams: t('howToBrew.validation.number', { name }) });
        } else if (Number.parseFloat(value) > Number.parseFloat(maxGramsValue)) {
          setErrors({ ...errors, grams: t('howToBrew.validation.lessThan', { name, limit: maxGramsValue }) });
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value: maxGramsValue }));
        } else {
          setErrors({ ...errors, grams: '' });
          dispatch(setBrewingMethodDetailedValues({ id: fieldName, value }));
        }
        break;
      }
      case 'ratio': {
        dispatch(setBrewingMethodDetailedValues({ id: fieldName, value: parseInt(value, 10) }));
        break;
      }
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { id, value, name } = e.target || e.current;
    validateField(id, value, name, e);
  };

  const calculateOtherInputs = () => {
    const newRatio = brewingMethodDetailedValues.ratio;
    const amountOfWater = numberOfCups;
    const infiniteGrams = !Number.isFinite(amountOfWater / newRatio);
    const newGrams = infiniteGrams ? 0 : Number.parseFloat(amountOfWater / newRatio)
      .toFixed(2)
      .replace(/[.,]00$/, '');
    dispatch(setBrewingMethodDetailedValues({ id: 'waterAmount', value: amountOfWater }));
    dispatch(setBrewingMethodDetailedValues({ id: 'grams', value: newGrams }));
  };

  useEffect(() => {
    if (baristaModeEnabled === false) {
      calculateOtherInputs();
    }
  }, [numberOfCups, waterAmount, ratio]);

  useEffect(() => {
    if (baristaModeEnabled) {
      if (focused === 'grams') {
        const value = Math.round(grams * ratio);
        if (value === 0 || value === undefined) {
          dispatch(setBrewingMethodDetailedValues({ id: 'waterAmount', value: 0 }));
        } else {
          dispatch(setBrewingMethodDetailedValues({ id: 'waterAmount', value: Math.round(grams * ratio) }));
        }
        setErrors({ ...errors, waterAmount: '' });
      } else if (focused === 'waterAmount') {
        dispatch(
          setBrewingMethodDetailedValues({ id: 'grams', value: Number.parseFloat(waterAmount / ratio).toFixed(2) }),
        );
        setErrors({ ...errors, grams: '' });
      } else if (focused === 'ratio') {
        const gramsValue = Number.parseFloat(waterAmount / ratio).toFixed(2);
        dispatch(setBrewingMethodDetailedValues({ id: 'grams', value: gramsValue }));
        const maxGrams = Number.parseFloat(maxWaterInTool / ratio)
          .toFixed(2)
          .replace(/[.,]00$/, '');
        setMaxGramsValue(maxGrams);
      }
    }
  }, [waterAmount, grams, ratio]);

  useEffect(() => {
    const maxGrams = Number.parseFloat(maxWaterInTool / ratio)
      .toFixed(2)
      .replace(/[.,]00$/, '');
    setMaxGramsValue(maxGrams);

    if (parseFloat(grams) > parseFloat(maxGrams)) {
      dispatch(setBrewingMethodDetailedValues({ id: 'grams', value: maxGrams }));
      setErrors({ ...errors, grams: t('howToBrew.validation.lessThan', { name: t('common.grams'), limit: maxGrams }) });
    } else {
      setErrors({ ...errors, grams: '' });
      dispatch(setBrewingMethodDetailedValues({ id: 'grams', value: grams }));
    }
  }, [maxGramsValue]);

  useEffect(() => {
    if (!baristaModeEnabled) {
      setErrors({ grams: '', waterAmount: '' });
    }
  }, [baristaModeEnabled]);

  /* eslint-disable no-nested-ternary */

  return (
    <div className="brewing-method-specifics">
      {brewingMethodSpecifics.map((item) => (
        <div className="brewing-method-specifics__item" key={item.id}>
          <Text className="brewing-method-specifics__item-title" type="caption">
            {t(`howToBrew.options.${item.id}`)}
          </Text>
          {baristaModeEnabled === item.editable ? (
            item.type === 'select' ? (
              <CustomDropdown
                value={item.value}
                options={ratioOptions}
                onChange={handleInputChange}
                id={item.id}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            ) : (
              <>
                <input
                  className="brewing-method-specifics__item-input"
                  value={item.value}
                  type="text"
                  id={item.id}
                  name={t(`howToBrew.options.${item.id}`)}
                  onChange={(e) => handleInputChange(e)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <AnimatePresence>
                  {errors[item.id] && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="brewing-method-specifics__item-input-error"
                    >
                      {errors[item.id]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )
          ) : (
            <Text className="brewing-method-specifics__item-value" type="caption">
              {item.value}
            </Text>
          )}
          <pre> </pre>
          <Text className="brewing-method-specifics__item-value" type="caption">
            {item.unit}
          </Text>
        </div>
      ))}
    </div>
  );
};
