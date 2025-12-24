import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { CheckboxButton } from '../../inputs/checkboxButton/CheckboxButton';
import { setNumberOfCups } from '../../../features/howToBrew/howToBrewSlice';
import './cupsFilters.scss';

const MAX_CUP_CAPACITY = 200;

export const CupsFilters = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const numberOfCups = useSelector((state) => state.howToBrew.numberOfCups);
  const maxWaterInTool = useSelector((state) => state.howToBrew.maxWaterInTool);
  const baristaModeEnabled = useSelector((state) => state.howToBrew.baristaModeEnabled);
  const activeFilter = useSelector((state) => state.howToBrew.activeFilter);

  const [inputsDisabled, setInputsDisabled] = useState(false);
  const inputRef = useRef(null);
  const prevNumberOfCups = useRef(null);

  const maxCups = Math.floor(maxWaterInTool / MAX_CUP_CAPACITY);

  const handleInputChange = (e) => {
    const value = e.target.value === 'more' ? 'more' : Number.parseInt(e.target.value, 10);
    if (value !== numberOfCups) {
      dispatch(setNumberOfCups(value));
    }
  };

  useEffect(() => {
    if (!baristaModeEnabled) {
      setInputsDisabled(false);
      dispatch(setNumberOfCups(inputRef.current ?? 200));
    } else {
      setInputsDisabled(true);
      dispatch(setNumberOfCups(0));
    }
  }, [baristaModeEnabled]);

  /* eslint-disable immutable/no-mutation */
  useEffect(() => {
    if (numberOfCups !== 0) {
      inputRef.current = numberOfCups;
    }
  }, [numberOfCups]);

  useEffect(() => {
    prevNumberOfCups.current = numberOfCups;
  }, [activeFilter]);

  useEffect(() => {
    if (prevNumberOfCups.current > maxWaterInTool) {
      dispatch(setNumberOfCups(maxCups * MAX_CUP_CAPACITY));
    } else if (prevNumberOfCups.current % MAX_CUP_CAPACITY !== 0) {
      dispatch(setNumberOfCups(prevNumberOfCups.current - (prevNumberOfCups.current % MAX_CUP_CAPACITY)));
    }
  }, [maxWaterInTool]);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={maxCups}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="howToBrew-cups-filters"
      >
        {Array(maxCups)
          .fill(null)
          .map((_, index) => (
            <CheckboxButton
              type="radio"
              key={index}
              text={`${index + 1} ${index > 0 ? t('common.cups') : t('common.cup')}`}
              name="cup"
              id={`how-to-brew-cup-${index}`}
              value={(index + 1) * 200}
              currentValue={numberOfCups}
              onChange={handleInputChange}
              disabled={inputsDisabled}
            />
          ))}
        {maxWaterInTool % MAX_CUP_CAPACITY !== 0 ? (
          <CheckboxButton
            type="radio"
            text={t('common.more')}
            name="cup"
            id="how-to-brew-more"
            value={maxWaterInTool}
            currentValue={numberOfCups}
            onChange={handleInputChange}
            disabled={inputsDisabled}
          />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};
