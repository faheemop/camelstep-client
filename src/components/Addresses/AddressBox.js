import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { eventBus } from '../../helpers/eventBus';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { Text } from '../Text/Text';
import { DeleteAddressModal } from './DeleteAddressModal';
import { AddressForm } from './AddressForm/AddressForm';
import { MapWrapper } from '../Map/MapWrapper';
import { useDeleteAddressMutation, useUpdateAddressMutation } from '../../services/user';

import './addressBox.scss';
import { resetAddresses, setCurrentStep } from '../../features/checkout/checkoutSlice';

/* eslint-disable react/jsx-props-no-spreading */
export const AddressBox = ({ addressData, addressPurpose }) => {
  const { t } = useTranslation('application');
  const currentCheckoutStep = useSelector((state) => state.checkout.currentStep);
  const dispatch = useDispatch();
  const pickedAddresses = useSelector((state) => state.checkout.pickedAddresses);

  const {
    id,
    full_name,
    phone,
    email,
    address_line_1,
    address_line_2,
    city,
    country,
    zipcode,
    is_default,
    latitude,
    longitude,
  } = addressData;
  const [isAddressEditFormActive, setIsAddressEditFormActive] = useState(false);
  const [deleteAddress] = useDeleteAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const handleAddressUpdate = async (values) => {
    const newAddress = {
      purpose: values.purpose,
      full_name: values.fullName,
      phone: values.phone,
      email: values.email,
      address_line_1: values.addressline1,
      address_line_2: values.addressline2,
      city: values.city,
      country: values.country,
      zipcode: values.zipcode,
      ...(values.isDefault && { default: true }),
    };

    try {
      await updateAddress({ id, body: newAddress });
      setIsAddressEditFormActive(false);
      const { top } = document.getElementById(id).getBoundingClientRect();
      window.scrollTo({ top: top + window.pageYOffset + 100, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddressDelete = async () => {
    const isOneOfPickedAddresses = Object.values(pickedAddresses).includes(id);
    if (currentCheckoutStep > 1 && isOneOfPickedAddresses) {
      dispatch(setCurrentStep(1));
      dispatch(resetAddresses());
    }
    await deleteAddress({ id });
  };

  const handleAddressDeleteButtonClick = async () => {
    eventBus.publish('modal:open', {
      alertType: true,
      body: <DeleteAddressModal deleteAction={handleAddressDelete} />,
    });
  };

  const getPosition = () => {
    if (!latitude && !longitude) {
      return null;
    }
    return [latitude, longitude];
  };

  const handleSetAsDefault = async () => {
    if (is_default) return;
    const newAddress = {
      purpose: addressPurpose,
      full_name,
      phone,
      email,
      address_line_1,
      address_line_2,
      city,
      country,
      zipcode,
      default: true,
    };
    try {
      await updateAddress({ id, body: newAddress });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="address-box" id={id}>
        <div className="address-box__content">
          <div className="address-box__content__title">
            <Text type="subtitle2">
              {' '}
              {full_name}
              {' '}
            </Text>
            <Text type="subtitle2">
              {phone}
              {' | '}
              {email}
            </Text>
            <Text type="subtitle2">
              {' '}
              {address_line_1}
              {' '}
            </Text>
            <Text type="subtitle2">
              {address_line_2}
              {' '}
            </Text>
            <Text type="subtitle2">
              {city}
              {' '}
              {zipcode}
              {' '}
              {country}
            </Text>
          </div>
          <div className="address-box__actions">
            <button type="button" onClick={() => handleAddressDeleteButtonClick()}>
              <SvgIcon id="icon-delete" width={32} height={32} />
            </button>
            <button type="button" onClick={() => setIsAddressEditFormActive((isAcitve) => !isAcitve)}>
              <SvgIcon id="icon-edit" width={32} height={32} />
            </button>
            <div className="checkbox">
              <label htmlFor={`default${addressPurpose}address${id}`} aria-label="address-purpose">
                <input className="visually-hidden" id={`default${addressPurpose}address${id}`} type="checkbox" onClick={() => handleSetAsDefault()} checked={is_default} />
                <span className="checkmark" />
              </label>
              {is_default && (
              <Text className="checkbox__adnotation" type="subtitle2">{t('profile.addresses.defaultAddressLabel')}</Text>
              )}
            </div>
          </div>
        </div>
      </div>
      {isAddressEditFormActive && (
        <div className="address-edit-form">
          <MapWrapper position={getPosition()} />
          <AddressForm onEditCancel={setIsAddressEditFormActive} {...addressData} onFormSubmit={handleAddressUpdate} />
        </div>
      )}
    </>
  );
};
