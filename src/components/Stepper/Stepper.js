import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { StepperIndicator } from './StepperIndicator';

import './stepper.scss';

export const Stepper = ({
  children, animation, layout, defaultStep = 1,
}) => {
  const [currentStep, setCurrentStep] = useState(defaultStep);

  const setStep = (idx) => {
    setCurrentStep(idx);
  };

  const defaultAnimation = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { duration: 0.5 },
  };

  const stepperAnimation = animation || defaultAnimation;

  const stepperClassNames = classNames({
    stepper: true,
    'stepper--vertical': layout === 'vertical',
    'stepper--horizontal': layout === 'horizontal',
  });

  return (
    <div
      style={{
        display: 'flex', flexGrow: 1, gap: '1rem', width: '100%',
      }}
      className={stepperClassNames}
    >
      <div className="stepper-indicator-wrapper" style={{ padding: 0 }}>
        <StepperIndicator
          currentStep={currentStep}
          className="col"
          numberOfSteps={children.length}
          setStep={setStep}
          layout={layout}
        />
      </div>
      <div
        style={{
          flexBasis: layout === 'vertical' ? '100%' : '100%',
          flexGrow: '1',
          flexShrink: '1',
          padding: 0,
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <motion.div key={`${currentStep}`} {...stepperAnimation} style={{ height: '100%' }}>
            {children.map((step, index) => {
              if (index + 1 === currentStep) {
                return React.cloneElement(step, {
                  ...step.props,
                  key: index,
                  numberOfSteps: children.length,
                  currentStep,
                  setStep: (idx) => setStep(idx),
                  nextStep: () => setCurrentStep(currentStep + 1),
                  previousStep: () => setCurrentStep(currentStep - 1),
                });
              }
              return null;
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
