import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CheckoutAddressTile } from '../../../components/Checkout/CheckoutAddressTile';
import { pickAddress } from '../../../features/checkout/checkoutSlice';

import './checkoutAddressSelection.scss';

export const AddressSelection = ({ addressType, addressClickHandler }) => {
  const userAddresses = useSelector((state) => state.user.addresses);
  const pickedAddress = useSelector((state) => state.checkout.pickedAddresses[addressType]);
  const dispatch = useDispatch();
  const preselectActive = useRef(true);
  const selectedIdRef = useRef(null);
  const isSelected = (addressId) => addressId === pickedAddress;

  const preselectIfUserHasDefaultAddress = () => {
    Object.keys(userAddresses).forEach((typeOfAddress) => {
      const selectedAddress = userAddresses[typeOfAddress].find((address) => isSelected(address.id));
      if (selectedAddress) {
        // eslint-disable-next-line immutable/no-mutation
        selectedIdRef.current = selectedAddress;
        dispatch(
          pickAddress({
            type: selectedAddress.purpose,
            address: selectedAddress.id,
          }),
        );
        return;
      }
      userAddresses[typeOfAddress].forEach((address) => {
        if (selectedIdRef?.current) return;
        if (address.is_default) {
          dispatch(
            pickAddress({
              type: address.purpose,
              address: address.id,
            }),
          );
        }
      });
    });
  };

  useEffect(() => {
    if (Object.keys(userAddresses).length > 0) {
      if (preselectActive.current) {
        preselectIfUserHasDefaultAddress();
        // eslint-disable-next-line immutable/no-mutation
        preselectActive.current = false;
      }
    }
  }, [userAddresses]);

  return (
    <div className="checkout-address-selection">
      {Object.keys(userAddresses).length > 0
        && userAddresses?.[addressType]?.map(
          ({
            purpose, id, full_name, phone, email, address_line_1, address_line_2, city, country, zipcode,
          }, index) => (
            <CheckoutAddressTile
              key={full_name + index}
              id={id}
              purpose={purpose}
              name={full_name}
              phone={phone}
              email={email}
              addressLine1={address_line_1}
              addressLine2={address_line_2}
              zipCode={zipcode}
              city={city}
              country={country}
              selected={isSelected(id)}
              addressClickHandler={addressClickHandler}
            />
          ),
        )}
      <CheckoutAddressTile addNew purpose={addressType} />
    </div>
  );
};
