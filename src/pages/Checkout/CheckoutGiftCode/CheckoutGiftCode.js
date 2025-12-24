import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiftCodeInput } from '../../../components/inputs/Input/GiftCodeInput';
import { setDiscountCode, setOrderPrices, setPaymentData } from '../../../features/checkout/checkoutSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import { useApplyDiscountCodeMutation } from '../../../services/order';
import { useGetCartProductsQuery } from '../../../services/cart';

export const CheckoutGiftCode = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.checkout.currentStep);
  const paymentData = useSelector((state) => state.checkout.paymentData);
  const discountCodeUsed = useSelector((state) => state.checkout.discountCode);
  const orderPrices = useSelector((state) => state.checkout.orderPrices);

  const [giftCodeValue, setGiftCodeValue] = useState('');
  const debouncedGiftCodeValue = useDebounce(giftCodeValue, 2000);
  const [error, setError] = useState(null);

  const { refetch: refetchCartProducts } = useGetCartProductsQuery();
  const [applyGiftCode, {
    data: discountCodeData, isLoading, error: discountCodeError, isSuccess, reset,
  }] = useApplyDiscountCodeMutation();

  const initialOrderPrices = useRef(null);
  const isInitialApplied = useRef(false);
  const lastAppliedCode = useRef(null);
  const userEnteredCode = useRef(false);

  // Save original prices
  useEffect(() => {
    const hasOrderPrices = orderPrices && Object.values(orderPrices).some(Boolean);
    if (!initialOrderPrices.current && hasOrderPrices && currentStep === 2) {
      initialOrderPrices.current = { ...orderPrices };
    }
  }, [orderPrices, currentStep]);

  // Auto apply persisted discount code on load
  useEffect(() => {
    const code = discountCodeUsed || paymentData?.usedDiscountCode;
    if (
      currentStep === 2 &&
      code &&
      !isInitialApplied.current &&
      !userEnteredCode.current &&
      code !== lastAppliedCode.current
    ) {
      reset();
      applyGiftCode(code)
        .unwrap()
        .then(() => {
          lastAppliedCode.current = code;
          isInitialApplied.current = true;
          setGiftCodeValue(code);
        })
        .catch((e) => console.error(e));
    }
  }, [discountCodeUsed, paymentData, currentStep]);

  // When user types a code → mark flag
  const handleGiftCodeChange = (val) => {
    userEnteredCode.current = true;
    setGiftCodeValue(val);
  };

  // Apply gift code when user enters it (debounced)
  useEffect(() => {
    if (currentStep !== 2) return;

    if (
      userEnteredCode.current &&
      debouncedGiftCodeValue &&
      debouncedGiftCodeValue !== lastAppliedCode.current
    ) {
      applyGiftCode(debouncedGiftCodeValue)
        .unwrap()
        .then(() => {
          lastAppliedCode.current = debouncedGiftCodeValue;
        })
        .catch((e) => console.error(e));
      dispatch(setDiscountCode(null));
      userEnteredCode.current = false;
    } else if (!debouncedGiftCodeValue && discountCodeUsed) {
      dispatch(setDiscountCode(null));
      setError(null);
    }
  }, [debouncedGiftCodeValue, currentStep]);

  // Handle API response
  useEffect(() => {
    if (discountCodeError) {
      const { status, data: { error: discountCodeErr, errors } } = discountCodeError;
      if (status === 404) {
        setError([discountCodeErr]);
        dispatch(setOrderPrices(initialOrderPrices.current));
        dispatch(setPaymentData({
          ...paymentData,
          order: {
            ...paymentData.order,
            totalPrice: initialOrderPrices.current.totalPrice,
            vatPrice: initialOrderPrices.current.vatPrice,
            summaryPrice: initialOrderPrices.current.summaryPrice,
            discountValue: 0.0,
          },
          amount: initialOrderPrices.current.summaryPrice,
        }));
        dispatch(setDiscountCode(null));
      } else if (status === 422) {
        const err = Object.values(errors);
        if (err.find((el) => el[0].startsWith('translation missing'))) return;
        setError(err);
      }
    }

    if (isSuccess) {
      refetchCartProducts();
      dispatch(setOrderPrices({
        totalPrice: discountCodeData.new_total_price,
        vatPrice: discountCodeData.new_vat_price,
        summaryPrice: discountCodeData.new_summary_price,
        discountValue: discountCodeData.discount_value,
      }));
      dispatch(setPaymentData({
        ...paymentData,
        order: {
          ...paymentData.order,
          totalPrice: discountCodeData.new_total_price,
          vatPrice: discountCodeData.new_vat_price,
          summaryPrice: discountCodeData.new_summary_price,
          discountValue: discountCodeData.discount_value,
        },
        amount: discountCodeData.new_summary_price,
      }));
      if (giftCodeValue !== discountCodeUsed) {
        dispatch(setDiscountCode(giftCodeValue));
      }
      setError(null);
    }
  }, [discountCodeError, isSuccess]);

  // Reset error on change
  useEffect(() => {
    if (giftCodeValue !== discountCodeUsed) setError(null);
  }, [giftCodeValue, discountCodeUsed]);

  return (
    currentStep === 2 && (
      <GiftCodeInput
        isLoading={isLoading}
        onGiftCodeChange={handleGiftCodeChange}
        error={error}
        success={isSuccess || discountCodeUsed}
        value={giftCodeValue}
      />
    )
  );
};
