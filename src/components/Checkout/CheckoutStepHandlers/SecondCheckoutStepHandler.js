import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from 'react-redux';
import {
  nextCheckoutStep,
  prevCheckoutStep,
  setOrderPrices,
  setPaymentData,
  setPendingPayment,
} from '../../../features/checkout/checkoutSlice';
import { useGetCartPackagesQuery, useGetCartProductsQuery } from '../../../services/cart';
import { useCreatePaymentMutation, useCreateShipmentMutation } from '../../../services/order';
import { Button } from '../../common/Button/Button';

export const SecondCheckoutStepHandler = ({ setError }) => {
  const { t } = useTranslation('application');

  const dispatch = useDispatch();
  const uncompletedPackages = useSelector((state) => state.checkout.uncompletedPackages);
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);
  const selectedStore = useSelector((state) => state.checkout.selectedStore);
  const isOrderAGift = useSelector((state) => state.checkout.isOrderAGift);
  const pickedAddresses = useSelector((state) => state.checkout.pickedAddresses);
  const giftMessage = useSelector((state) => state.checkout.giftMessage);
  const { data: { records: { length: recordsLength } = [] } = {} } = useGetCartProductsQuery();
  const { data: { records: { length: packageRecordsLength } = [] } = {} } = useGetCartPackagesQuery();

  const [createShipment] = useCreateShipmentMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [disabled, setDisabled] = useState(false);

  const isOneOfDeliveryOptions = ['international', 'internal'].includes(shipmentOption);

  const verifyStep = async () => {
    // TODO: probably better error handling / actions taken to be done here when all the following issues will be resolved and possible unknown eg. locked cart, incorrect price sum on backend etc.
    const requestBody = {
      shipment: {
        type: shipmentOption,
      },
      order: {
        shipping_address_id: isOrderAGift ? pickedAddresses.gift : pickedAddresses.shipping,
        billing_address_id: pickedAddresses.billing,
        ...(isOrderAGift && { gift_address_id: pickedAddresses.gift }),
        ...(isOrderAGift && giftMessage && { gift_note: giftMessage }),
        ...(selectedStore !== 'none' && { preferred_location_id: selectedStore }),
      },
    };

    if (uncompletedPackages.length > 0) return;

    if (shipmentOption === 'pickup') {
      if (selectedStore === 'none') {
        setError(t('checkout.errors.chooseStore'));
      }

      if (selectedStore !== 'none') {
        setDisabled(false);
        try {
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
            // TODO: handle error to be discussed
          }
        } catch (error) {
          console.error(error);
        }
        dispatch(nextCheckoutStep());
        setError('');
      }
    }

    if (isOneOfDeliveryOptions) {
      setDisabled(false);
      try {
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
              shipmentPrice: data.order.shipmentPrice,
              vatPrice: data.order.vatPrice,
              summaryPrice: amount,
            }),
          );
        }
        if (paymentData.error) {
          // TODO: handle error to be discussed
        }
        dispatch(setPendingPayment(true));
        dispatch(nextCheckoutStep());
        setError('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const isDisabled = uncompletedPackages.length > 0 || (recordsLength === 0 && packageRecordsLength === 0);
    setDisabled(isDisabled);
  }, [uncompletedPackages, recordsLength, packageRecordsLength]);

  return (
    <>
      <Button type="primary" inverted buttonType="button" text={t('common.back')} onClick={() => dispatch(prevCheckoutStep())} />
      <Button disabled={disabled} type="primary" text={t('common.next')} buttonType="button" onClick={verifyStep} />
    </>
  );
};
