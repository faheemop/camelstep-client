import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useSelector } from 'react-redux';
import { useGetProductRecipeQuery } from '../../../services/products';
import { Stepper } from '../../Stepper/Stepper';
import { Text } from '../../Text/Text';
import { BrewStep } from '../BrewStep/BrewStep';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import { useGetSpecificRecipeQuery } from '../../../services/howToBrew';

export const HowToBrewStepper = ({ nextStep, previousStep, currentStep }) => {
  const { t } = useTranslation('application');
  const { productId } = useParams();
  const activeFilter = useSelector((state) => state.howToBrew.activeFilter);

  const [skip, setSkip] = useState(true);
  const [brewSteps, setBrewSteps] = useState([]);
  const { data, error, isFetching } = useGetProductRecipeQuery(productId ?? skipToken);
  const {
    data: specificRecipeData,
    error: specificRecipeDataError,
    isFetching: isSpecificRecipeDataFetching,
    refetch: refetchSpecificRecipe,
  } = useGetSpecificRecipeQuery(activeFilter, { skip });

  useEffect(() => {
    if (!productId) {
      if (activeFilter !== null) setSkip(false);
    } else {
      setSkip(true);
    }
  }, [productId, activeFilter]);

  useEffect(() => {
    if (!productId) {
      if (specificRecipeData) {
        setBrewSteps(specificRecipeData.steps);
      }
    } else if (data) {
      setBrewSteps(data.steps);
    }
  }, [specificRecipeData, data]);

  useEffect(() => {
    if (!specificRecipeData) return;
    i18next.on('languageChanged', refetchSpecificRecipe);

    // eslint-disable-next-line consistent-return
    return () => {
      i18next.off('languageChanged', refetchSpecificRecipe);
    };
  }, [specificRecipeData]);

  const getContent = () => {
    if (isFetching || isSpecificRecipeDataFetching) {
      return (
        <LoadingSpinner />
      );
    }
    if (error || specificRecipeDataError) {
      return (
        <Text type="headline2" style={{ display: 'inline-block', margin: '0 auto' }}>{error?.data?.error || t('howToBrew.somethingWentWrong')}</Text>
      );
    }

    return (
      brewSteps.length > 0 && (
        <motion.div key={activeFilter} transition={{ duration: 0.5 }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
          <Stepper
            layout="horizontal"
            animation={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.5 },
            }}
          >
            {brewSteps.map((brewStep) => (
              <BrewStep
                key={brewStep.id}
                brewStepData={brewStep}
                nextStep={nextStep}
                previousStep={previousStep}
                currentStep={currentStep}
              />
            ))}
          </Stepper>
        </motion.div>
      )
    );
  };

  return <AnimatePresence exitBeforeEnter>{getContent()}</AnimatePresence>;
};
