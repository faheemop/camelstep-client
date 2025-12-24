import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../common/Button/Button';

export const BrewStepButtons = ({
  nextStep, previousStep, currentStep, numberOfSteps,
}) => {
  const { t } = useTranslation('application');
  return (
    <>
      {currentStep > 1 && (
        <Button
          text={t('common.previous')}
          type="primary"
          inverted
          onClick={() => previousStep()}
          style={{ marginInlineEnd: '1rem', marginTop: '1rem' }}
        />
      )}
      {currentStep < numberOfSteps && (
        <Button
          text={t('common.next')}
          type="primary"
          onClick={() => nextStep()}
          style={{ marginInlineEnd: '1rem', marginTop: '1rem' }}
        />
      )}
    </>
  );
};
