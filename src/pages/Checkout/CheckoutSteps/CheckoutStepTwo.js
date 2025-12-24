import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import { Text } from '../../../components/Text/Text';
import { CheckboxButton } from '../../../components/inputs/checkboxButton/CheckboxButton';
import { CustomCheckbox } from '../../../components/inputs/CustomCheckbox/CustomCheckbox';
import { useGetCartPackagesQuery, useGetCartProductsQuery } from '../../../services/cart';
import { useGetShippingOptionsQuery, useGetSavedAddressesQuery } from '../../../services/order';
import { eventBus } from '../../../helpers/eventBus';
import { UnresolvedProductsModal } from '../UnresolvedProductsModal/UnresolvedProductsModal';
import {
  setAvailableServices,
  setPendingPayment,
  setOrderPrices,
  setSelectedStore,
  setShipmentOption,
  setUncompletedPackages,
  pickAddress,
  toggleIfOrderIsAGift,
} from '../../../features/checkout/checkoutSlice';
import { ChosenShipmentType } from '../ChosenShipmentType';
import { useScrollToTop } from '../../../hooks/useScrollToTop';
import { Vatinfo } from '../../../components/VatInfo/Vatinfo';
import { AddressSelection } from '../CheckoutAddressSelection/CheckoutAddressSelection';
import './checkoutStep.scss';

export const CheckoutStepTwo = () => {
  const availableServices = [
    {
      name: 'pickup',
      type: 'pickup',
    },
    {
      name: 'delivery',
      type: 'delivery',
    },
  ];
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);
  const uncompletedPackages = useSelector((state) => state.checkout.uncompletedPackages);
  const isOrderAGift = useSelector((state) => state.checkout.isOrderAGift);
  const shippingAddressId = useSelector((state) => state.checkout.pickedAddresses.shipping);
  const giftAddressId = useSelector((state) => state.checkout.pickedAddresses.gift);
  const selectedStore = useSelector((state) => state.checkout.selectedStore);
  const pickedAddresses = useSelector((state) => state.checkout.pickedAddresses);
  const [modalReady, setModalReady] = useState(true);
  const availableDeliveryOptions = availableServices;

  const { data: addressData, isLoading, error: addressFetchError } = useGetSavedAddressesQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: stateData } = useGetCartProductsQuery({ refetchOnMountOrArgChange: true });
  const { data: packageStateData } = useGetCartPackagesQuery({ refetchOnMountOrArgChange: true });
  const {
    data, error, refetch,
  } = useGetShippingOptionsQuery({
    shipmentType: shipmentOption,
    shippingAddressId: shippingAddressId,
    preferredLocationId: selectedStore,
  });

  const [stores, setStores] = useState([]);

  useScrollToTop({
    isSmooth: true,
  });

  useEffect(() => {
    if (error?.status === 425) {
      dispatch(setPendingPayment(true));
    }
  }, [error]);

  useEffect(() => {
    dispatch(setSelectedStore('none'));
    const modalReadySubscription = eventBus.subscribe('modal:ready', () => {
      setModalReady(true);
    });

    return () => {
      modalReadySubscription.remove();
    };
  }, []);

  useEffect(() => {
    if ((stateData?.records?.length === 0 && packageStateData?.records?.length === 0)) {
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
    if (data) {
      dispatch(setUncompletedPackages(data.unresolved_products));
      dispatch(
        setOrderPrices({
          shipmentPrice: data.shipment_price,
          totalPrice: data.total_price,
          summaryPrice: data.summary_price,
          vatPrice: data.vat_price,
          estimatedVatPrice: data.estimated_vat_price,
        }),
      );
      dispatch(setAvailableServices(availableDeliveryOptions));

      // Find unique stores by id for products
      // and bundles and assign to stores.
      const allStores = [...data.pickup_stores_list];
      data.bundle_packages?.forEach((bundle) => bundle.pickup_stores_list?.forEach((bundle_store) => allStores.push(bundle_store)));

      setStores(_.uniqBy(allStores, 'id'));
    }
  }, [data]);

  useEffect(() => {
    if (uncompletedPackages.length > 0 && modalReady) {
      setModalReady(false);
      eventBus.publish('modal:open', {
        title: `${t('unresolvedProducts.heading', { count: uncompletedPackages.length })} ${t(`delivery.${shipmentOption}`).toLowerCase()}`,
        body: <UnresolvedProductsModal
          products={uncompletedPackages}
          refetch={refetch}
        />,
        noClose: true,
        clearOnPathChange: true,
      });
    }
  }, [uncompletedPackages, modalReady]);

  useEffect(() => {
    refetch();
  }, [stateData?.records, shipmentOption, selectedStore, packageStateData?.records]);

  const singleOrMulti = (type) => {
    switch (type) {
      case 'shipping':
        return t('checkout.newShippingAddress');
      case 'billing':
        return t('checkout.newBillingAddress');
      default:
        return addressData.filter(({ purpose }) => purpose === type).length > 1
          ? t('profile.addresses.addressPurposeTitle', { addressPurpose: t(`forms.addressPurpose.${type}`) })
          : t(`checkout.${type}Address`);
    }
  };

  useEffect(() => {
    if (addressFetchError?.status === 425) {
      dispatch(setPendingPayment(true));
    }
  }, [addressFetchError]);
  if (addressFetchError) return null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleShipmentOptionChange = (ev) => {
    const { value } = ev.target;
    dispatch(setShipmentOption(value));
    if (value === 'delivery') {
      dispatch(toggleIfOrderIsAGift(false));
    }
  };

  return (
    <>
      <div className="checkout-step">
        <Text className="checkout-step__heading" type="headline3">
          {t('delivery.typeSelect')}
        </Text>
        <Vatinfo />
        <div className="delivery-options">
          {availableDeliveryOptions.length > 0
            && availableDeliveryOptions.map((opt, index) => (
              <CheckboxButton
                key={`${opt.type} ${index}}`}
                currentValue={shipmentOption}
                onChange={(ev) => handleShipmentOptionChange(ev)}
                type="radio"
                name="deliveryType"
                id={opt.name}
                text={t(`delivery.${opt.type}`)}
                value={opt.type}
                disabled={opt?.disabled}
              />
            ))}
        </div>
        <ChosenShipmentType
          shipmentOption={shipmentOption}
          packages={[]}
          stores={stores}
        />
      </div>
      {shipmentOption !== 'pickup'
        && (
          <>
            <div className="checkout-step checkout-step-one">
              <div className="address-block">
                <Text className="checkout-step__heading" type="headline3">
                  {singleOrMulti('shipping')}
                </Text>
                <AddressSelection addressType="shipping" />
              </div>
            </div>
          </>
        )}
    </>
  );
};
