import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AddressForm } from '../../../components/Addresses/AddressForm/AddressForm';
import { AdressesList } from '../../../components/Addresses/AdressesList';
import { Button } from '../../../components/common/Button/Button';
import { MapWrapper } from '../../../components/Map/MapWrapper';
import { Text } from '../../../components/Text/Text';
import { useCreateAddressMutation, useGetAddressessQuery } from '../../../services/user';

import './addresses.scss';
import { GoogleMapWrapper } from '../../../components/GoogleMap/GoogleMapWrapper';

export const Addresses = () => {
  const { t } = useTranslation('application');
  const [isAddNewAddressFormActive, setIsAddNewAddressFormActive] = useState(false);
  const [addNewAddress] = useCreateAddressMutation();
  const { isLoading } = useGetAddressessQuery(undefined, { refetchOnMountOrArgChange: true });
  const userAddresses = useSelector((state) => state.user.addresses);
  const [newAddressCoordinates, setNewAddressCoordinates] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleAddNewAddress = async (values, formikObj) => {
    const { setFieldError } = formikObj;
    const {
      purpose, fullName, phone, email, addressline1, addressline2, city, country, zipcode, isDefault,
    } = values;

    const newAddress = {
      purpose,
      full_name: fullName,
      phone,
      email,
      address_line_1: addressline1,
      address_line_2: addressline2,
      city,
      country,
      zipcode,
      ...(isDefault && { default: true }),
    };

    try {
      const result = await addNewAddress(newAddress);
      if (result?.error && typeof (setFieldError) === 'function') {
        const { errors } = result.error.data;
        if (errors?.base) {
          setFieldError('root', t('forms.invalidAddress'));
        } else {
          Object.keys(errors).forEach((key) => {
            setFieldError(key, t(`forms.${key === 'zipcode' ? 'zip' : key}.validationMsg`));
          });
        }
        return;
      }
      setNewAddressCoordinates([result.data.latitude, result.data.longitude]);
      setIsAddNewAddressFormActive(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getPosition = (latitude, longitude) => {
    if (!latitude && !longitude) {
      return null;
    }
    return [latitude, longitude];
  };

  return (
    <div className="profile-subpage profile-addresses">
      {!isAddNewAddressFormActive ? (
        <>
          <Text className="profile-subpage__title" type="headline3">{t('profile.nav.addresses')}</Text>
          <Text type="body2" style={{ marginBottom: '2rem', marginTop: '1.6rem' }}>
            {t('profile.addresses.info')}
          </Text>
          <AdressesList data={userAddresses} isLoading={isLoading} />
          <Button
            type="primary"
            text={t('forms.addAddress')}
            onClick={() => setIsAddNewAddressFormActive(true)}
            style={{ minHeight: '40px' }}
          />
        </>
      ) : (
        <>
          <GoogleMapWrapper
            position={getPosition(newAddressCoordinates[0], newAddressCoordinates[1])}
            onLocationSelect={(coords) => setSelectedLocation(coords)}
          />
          <AddressForm
            onEditCancel={setIsAddNewAddressFormActive}
            onFormSubmit={handleAddNewAddress}
            address_line_1={selectedLocation ? selectedLocation.fullAddress : ''}
          />
        </>
      )}
    </div>
  );
};
