import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  nextCheckoutStep,
  setOrderPrices,
  setPaymentData,
  setPendingPayment,
} from '../../../features/checkout/checkoutSlice';
import { useGetCartPackagesQuery, useGetCartProductsQuery } from '../../../services/cart';
import { useCreatePaymentMutation, useCreateShipmentMutation } from '../../../services/order';

import { Button } from '../../common/Button/Button';

export const FirstCheckoutStepHandler = ({ setError }) => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const pickedAddresses = useSelector((state) => state.checkout.pickedAddresses);
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);
  const isOrderAGift = useSelector((state) => state.checkout.isOrderAGift);
  const uncompletedPackages = useSelector((state) => state.checkout.uncompletedPackages);
  const selectedStore = useSelector((state) => state.checkout.selectedStore);
  const giftMessage = useSelector((state) => state.checkout.giftMessage);
  const { data: { records: { length: recordsLength } = [] } = {} } = useGetCartProductsQuery();
  const { data: { records: { length: packageRecordsLength } = [] } = {} } = useGetCartPackagesQuery();

  const [createShipment] = useCreateShipmentMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [disabled, setDisabled] = useState(false);

  const generateRequestBody = () => ({
    shipment: {
      type: shipmentOption,
    },
    order: {
      shipping_address_id: pickedAddresses.shipping,
      billing_address_id: pickedAddresses.billing,
      ...(isOrderAGift && { gift_address_id: pickedAddresses.shipping }),
      ...(isOrderAGift && giftMessage && { gift_note: giftMessage }),
      ...(selectedStore !== 'none' && { preferred_location_id: selectedStore }),
    },
  });

  const processShipmentAndPayment = async (requestBody) => {
    await createShipment(requestBody);
    const paymentData = await createPayment();
    const {
      data,
      data: { amount },
    } = paymentData;

    if (data) {
      dispatch(setPaymentData(data));
      dispatch(
        setOrderPrices({
          totalPrice: data.order.totalPrice,
          discountValue: data.order.discountValue,
          vatPrice: data.order.vatPrice,
          summaryPrice: amount,
        }),
      );
    }

    if (paymentData.error) {
      console.log(paymentData.error);
    }
  };

  // Method to validate and handle api request for Pickup Order
  const handlePickupOption = async (requestBody) => {
    if (selectedStore === 'none') {
      setError(t('checkout.errors.chooseStore'));
      return;
    }
    if (shipmentOption !== 'pickup' && pickedAddresses.billing === null) {
      setError(t('checkout.errors.addBillingAddress'));
      return;
    }

    setDisabled(false);
    try {
      await processShipmentAndPayment(requestBody);
      dispatch(nextCheckoutStep());
      setError('');
    } catch (error) {
      console.error(error);
    }
  };

  // Method to validate and handle api request for Delivery Order
  const handleDeliveryOption = async (requestBody) => {
    let error = '';

    if (!pickedAddresses.shipping) {
      error = t('checkout.errors.addShippingAddress');
    } else if (shipmentOption !== 'pickup' && !pickedAddresses.billing) {
      error = t('checkout.errors.addBillingAddress');
    }

    if (error) {
      setError(error);
      return;
    }
    setDisabled(false);
    try {
      await processShipmentAndPayment(requestBody);
      dispatch(setPendingPayment(true));
      dispatch(nextCheckoutStep());
      setError('');
    } catch (err) {
      console.error(err);
    }
  };

  // Method to validate selected Order Option and generate request body
  const verifyStep = async () => {
    if (uncompletedPackages.length > 0) return;

    const requestBody = generateRequestBody();

    console.warn(requestBody);

    if (shipmentOption === 'pickup') {
      handlePickupOption(requestBody);
    }

    if (shipmentOption === 'delivery') {
      handleDeliveryOption(requestBody);
    }
  };

  useEffect(() => {
    const isDisabled = uncompletedPackages?.length > 0 || (recordsLength === 0 && packageRecordsLength === 0);
    setDisabled(isDisabled);
  }, [uncompletedPackages, recordsLength, packageRecordsLength]);

  return <Button type="primary" buttonType="button" text={t('common.next')} onClick={verifyStep} disabled={disabled} />;
};
