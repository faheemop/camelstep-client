import React, { useEffect } from 'react';
import { Col, Row, Container } from 'react-grid-system';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Logo from '../../assets/icons/Logo.svg';
import { Button } from '../../components/common/Button/Button';
import { CheckoutStepTwo } from './CheckoutSteps/CheckoutStepTwo';
import { CheckoutStepThree } from './CheckoutSteps/CheckoutStepThree';
import { CheckoutStepper } from '../../components/Stepper/CheckoutStepper';
import { toggleCartModal } from '../../features/cart/cartSlice';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutPendingPayment } from '../../components/Checkout/PendingPayment/CheckoutPendingPayment';

import { useUnlockCartMutation } from '../../services/cart';
import { setDiscountCode, setCurrentStep, setPendingPayment } from '../../features/checkout/checkoutSlice';

import './checkoutPage.scss';
import { CheckoutContext } from './checkoutContext';
import { localizedPath } from '../../helpers/localizedPath';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFormSubmitted = true;
  const isCartModalOpen = useSelector((state) => state.cart.isOpen);
  const { t } = useTranslation('application');
  const isPaymentPending = useSelector((state) => state.checkout.pendingPayment);
  const currentStep = useSelector((state) => state.checkout.currentStep);
  const [unlockCart] = useUnlockCartMutation();

  useEffect(() => {
    if (isCartModalOpen) {
      dispatch(toggleCartModal());
    }
  }, []);

  const handleCartUnlock = () => {
    dispatch(setCurrentStep(1));
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    unlockCart();
  };

  const handleBackToCartNavigation = () => {
    navigate(localizedPath('/'));
    dispatch(toggleCartModal());
    handleCartUnlock();
  };

  if (isPaymentPending && currentStep !== 2) {
    return (
      <div className="checkout-page">
        <Container fluid style={{ width: '100%' }}>
          <Row>
            <Col lg={12} style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
              <div className="checkout__top">
                <Link to={localizedPath('/')} onClick={handleBackToCartNavigation}>
                  <Logo />
                </Link>
                <Button type="naked" onClick={handleBackToCartNavigation}>{t('checkout.goBackToCart')}</Button>
              </div>
              <CheckoutPendingPayment />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CheckoutContext.Provider>
      <div style={{ background: 'linear-gradient(90deg, #FFFFFF 50%, #F7F7F7 50%', flex: 1, display: 'flex' }} className="checkout-page">
        <Container fluid style={{ width: '100%' }}>
          <Row style={{ height: '100%' }}>
            <Col lg={7} style={{ backgroundColor: '#FFFFFF', paddingTop: '2rem', paddingBottom: '4rem' }}>
              <div className="checkout__col">
                <div className="checkout__top">
                  <Link to={localizedPath('/')} onClick={handleBackToCartNavigation}>
                    <Logo />
                  </Link>
                  <Button type="naked" onClick={handleBackToCartNavigation}>{t('checkout.goBackToCart')}</Button>
                </div>
                <CheckoutStepper layout="vertical" canGoNextCondition={isFormSubmitted}>
                  {/* <CheckoutStepOne /> */}
                  <CheckoutStepTwo />
                  <CheckoutStepThree />
                </CheckoutStepper>
              </div>
            </Col>
            <Col lg={5} style={{ backgroundColor: '#F7F7F7' }}>
              <div className="checkout-sidebar">
                <CheckoutSummary />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </CheckoutContext.Provider>
  );
};
