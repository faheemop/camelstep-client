import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import { Text } from '../../../components/Text/Text';
import { setPendingPayment, setOrderPrices } from '../../../features/checkout/checkoutSlice';
import { useScrollToTop } from '../../../hooks/useScrollToTop';
import { useGetCartPackagesQuery, useGetCartProductsQuery } from '../../../services/cart';
import { useGetSavedAddressesQuery, useGetShippingOptionsQuery } from '../../../services/order';
import { AddressSelection } from '../CheckoutAddressSelection/CheckoutAddressSelection';

import './checkoutStep.scss';

export const CheckoutStepOne = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetSavedAddressesQuery(undefined, { refetchOnMountOrArgChange: true });

  const isOrderAGift = useSelector((state) => state.checkout.isOrderAGift);
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);
  const shippingAddressId = useSelector((state) => state.checkout.pickedAddresses.shipping);
  const giftAddressId = useSelector((state) => state.checkout.pickedAddresses.gift);
  const selectedStore = useSelector((state) => state.checkout.selectedStore);

  const { data: stateData } = useGetCartProductsQuery({ refetchOnMountOrArgChange: true });
  const { data: statePackagesData } = useGetCartPackagesQuery({ refetchOnMountOrArgChange: true });
  const { data: shippingData } = useGetShippingOptionsQuery({
    shipmentType: shipmentOption,
    shippingAddressId: shippingAddressId,
    preferredLocationId: selectedStore,
  });

  useEffect(() => {
    if (stateData?.records?.length === 0 && statePackagesData?.records?.length === 0) {
      dispatch(
        setOrderPrices({
          shipmentPrice: null,
          totalPrice: null,
          summaryPrice: null,
          vatPrice: null,
          estimatedVatPrice: null,
        }),
      );
      return;
    }
    if (shippingData) {
      dispatch(
        setOrderPrices({
          shipmentPrice: shippingData.shipment_price,
          totalPrice: shippingData.total_price,
          summaryPrice: shippingData.summary_price,
          vatPrice: shippingData.vat_price,
          estimatedVatPrice: shippingData.estimated_vat_price,
        }),
      );
    }
  }, [shippingData]);

  useScrollToTop({
    isSmooth: true,
  });

  useEffect(() => {
    if (error?.status === 425) {
      dispatch(setPendingPayment(true));
    }
  }, [error]);
  if (error) return null;
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const singleOrMulti = (type) => {
    if (type === 'shipping') {
      return t('checkout.newShippingAddress');
    }
    if (type === 'billing') {
      return t('checkout.newBillingAddress');
    }
    return (
      data.filter(({ purpose }) => purpose === type).length > 1
        ? t('profile.addresses.addressPurposeTitle', { addressPurpose: t(`forms.addressPurpose.${type}`) })
        : t(`checkout.${type}Address`)
    );
  };

  return (
    <div className="checkout-step checkout-step-one">
      {isOrderAGift ? (
        <div className="address-block">
          <Text className="checkout-step__heading" type="headline3">
            {singleOrMulti('gift')}
          </Text>
          <Text className="checkout-step__subheading" type="body2">
            {t('checkout.selectOrAdd', { purpose: t('checkout.giftAddress') })}
          </Text>
          <AddressSelection addressType="gift" />
        </div>
      ) : (
        <div className="address-block">
          <Text className="checkout-step__heading" type="headline3">
            {singleOrMulti('shipping')}
          </Text>
          <Text className="checkout-step__subheading" type="body2">
            {t('checkout.selectOrAddShipping')}
          </Text>
          <AddressSelection addressType="shipping" />
        </div>
      )}
      <div className="address-block">
        <Text className="checkout-step__heading" type="headline3">
          {singleOrMulti('billing')}
        </Text>
        <Text className="checkout-step__subheading" type="body2">
          {t('checkout.selectOrAddBilling')}
        </Text>
        <AddressSelection addressType="billing" />
      </div>
    </div>
  );
};
