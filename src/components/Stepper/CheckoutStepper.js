import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { StepperIndicator } from './StepperIndicator';
import { nextCheckoutStep, prevCheckoutStep } from '../../features/checkout/checkoutSlice';

import './stepper.scss';

const defaultAnimation = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 },
  transition: { duration: 0.5 },
};

export const CheckoutStepper = ({ children, animation, layout }) => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.checkout.currentStep);

  const nextStep = () => dispatch(nextCheckoutStep());
  const prevStep = () => dispatch(prevCheckoutStep());

  const stepperAnimation = animation || defaultAnimation;

  const stepperClassNames = classNames({
    stepper: true,
    'stepper--vertical': layout === 'vertical',
    'stepper--horizontal': layout === 'horizontal',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexGrow: 1,
        gap: '1rem',
        width: '100%',
      }}
      className={stepperClassNames}
    >
      <div className="stepper-indicator-wrapper" style={{ padding: 0 }}>
        <StepperIndicator
          currentStep={currentStep}
          className="col"
          numberOfSteps={children.length}
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
                  nextStep,
                  previousStep: prevStep,
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
