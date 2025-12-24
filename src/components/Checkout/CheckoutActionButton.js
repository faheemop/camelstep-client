import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Alert } from '../common/Alert/Alert';
import { FirstCheckoutStepHandler } from './CheckoutStepHandlers/FirstCheckoutStepHandler';
import { SecondCheckoutStepHandler } from './CheckoutStepHandlers/SecondCheckoutStepHandler';
import { ThirdCheckoutStepHandler } from './CheckoutStepHandlers/ThirdCheckoutStepHandler';
import './CheckoutAction.scss';

export const CheckoutActionButton = () => {
  const currentStep = useSelector((state) => state.checkout.currentStep);
  const [error, setError] = useState('');

  const renderButton = (step) => {
    switch (step) {
      case 1:
        return <FirstCheckoutStepHandler setError={setError} />;
      case 2:
        return <ThirdCheckoutStepHandler />;
      case 3:
        return <SecondCheckoutStepHandler setError={setError} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="checkout__buttons">{renderButton(currentStep)}</div>
      <div className="error-container">
        {error && <Alert type="danger">{error}</Alert>}
      </div>
    </>
  );
};
