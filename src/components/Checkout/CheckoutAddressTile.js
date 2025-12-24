import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { pickAddress, resetAddresses, setShipmentOption } from '../../features/checkout/checkoutSlice';
import { eventBus } from '../../helpers/eventBus';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { Text } from '../Text/Text';
import { CheckoutNewAddressForm } from './CheckoutNewAddressForm';
import './checkoutAddressTile.scss';
import { capitalizeFirstLetter } from '../../helpers/textHelpers';
import { useDeleteAddressMutation } from '../../services/user';
import { DeleteAddressModal } from '../Addresses/DeleteAddressModal';

export const CheckoutAddressTile = ({
  id,
  purpose,
  name,
  phone,
  email,
  addressLine1,
  addressLine2,
  zipCode,
  city,
  country,
  addNew,
  selected,
}) => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const [deleteAddress] = useDeleteAddressMutation();
  const pickedAddresses = useSelector((state) => state.checkout.pickedAddresses);

  const addNewAddress = () => {
    eventBus.publish('modal:open', {
      title: t(`checkout.new${capitalizeFirstLetter(purpose)}Address`),
      body: <CheckoutNewAddressForm purpose={purpose} />,
      fixedWidth: true,
    });
  };

  const editAddress = (e) => {
    e.stopPropagation();
    // Prepare initial values for the edit form
    const initialData = {
      fullName: name, // Assuming 'name' corresponds to full name
      phone,
      email,
      addressline1: addressLine1, // Make sure these keys match the form field names
      addressline2: addressLine2,
      city,
      country,
      zipcode: zipCode,
    };
    eventBus.publish('modal:open', {
      title: t(`checkout.edit${capitalizeFirstLetter(purpose)}Address`),
      // Pass both initialValues and isEdit flag to the form
      body: <CheckoutNewAddressForm purpose={purpose} initialValues={initialData} id={id} isEdit />,
      fixedWidth: true,
    });
  };

  const handleAddressPick = (type, addressId) => {
    dispatch(
      pickAddress({
        type,
        address: addressId,
      }),
    );
    if (type === 'billing') return;
    dispatch(setShipmentOption('delivery'));
  };

  const handleAddressDelete = async () => {
    const isOneOfPickedAddresses = Object.values(pickedAddresses).includes(id);
    if (isOneOfPickedAddresses) {
      dispatch(resetAddresses());
    }
    await deleteAddress({ id });
  };

  const handleAddressDeleteButtonClick = async (e) => {
    e.stopPropagation();
    eventBus.publish('modal:open', {
      alertType: true,
      body: <DeleteAddressModal deleteAction={handleAddressDelete} />,
    });
  };

  useEffect(() => {
    if (purpose === 'billing' || !selected) return;
    dispatch(setShipmentOption('delivery'));
  }, [dispatch, purpose, selected]);

  if (addNew) {
    return (
      <button
        type="button"
        className="checkout-address-tile checkout-address-tile--add"
        onClick={addNewAddress}
      >
        <SvgIcon id="icon-map-location" width={72} height={72} />
        <Text type="body2">
          {t('checkout.addAddress')}
        </Text>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`checkout-address-tile ${selected ? 'selected' : ''}`}
      onClick={() => handleAddressPick(purpose, id)}
    >
      <button type="button" className="checkout-address-tile__edit" onClick={editAddress}>
        <SvgIcon id="icon-edit" width={32} height={32} />
      </button>
      <button type="button" className="checkout-address-tile__delete" onClick={handleAddressDeleteButtonClick}>
        <SvgIcon id="icon-delete" width={32} height={32} />
      </button>
      <div className="checkout-address-tile__check" />
      <Text className="checkout-address-tile__text" type="body2">
        {name}
      </Text>
      <Text className="checkout-address-tile__text" type="body2">
        {phone}
      </Text>
      <Text className="checkout-address-tile__text" type="body2">
        {`${addressLine1}, ${addressLine2}`}
      </Text>
      <Text className="checkout-address-tile__text" type="body2">
        {`${zipCode}, ${city}, ${country}`}
      </Text>
    </button>
  );
};
