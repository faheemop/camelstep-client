import React from 'react';

import './stepperIndicator.scss';

export const StepperIndicator = ({
  currentStep, numberOfSteps, setStep,
}) => (
  <div className="stepper-indicator">
    {Array(numberOfSteps).fill('x').map((_, idx) => (
      <button
        key={idx}
        type="button"
        onClick={setStep ? () => setStep(idx + 1) : null}
        className={`stepper-indicator__item ${currentStep === idx + 1 ? 'active' : ''} ${!setStep ? 'no-cursor' : ''}`}
      >
        {idx <= 8 ? `0${idx + 1}` : idx + 1}
      </button>
    ))}
  </div>
);
