import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CustomSelect } from '../../../components/inputs/CustomSelect/CustomSelect';
import { OrderPackagesList } from '../../../components/Order/OrderPackage/OrderPackagesList';
import { Text } from '../../../components/Text/Text';
import { setSelectedStore } from '../../../features/checkout/checkoutSlice';
import { branchesCitiesOptions, branchesCountriesOptions } from '../../../utils/branchesLocation';
import LinkIcon from '../../../assets/icons/link.svg';

import './Pickup.scss';

export const PickupOption = ({ packages, stores }) => {
  const { t } = useTranslation('application');
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const dispatch = useDispatch();
  const selectedStore = useSelector((state) => state.checkout.selectedStore);
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);

  const moreThanOneStore = stores.length > 0;
  const singleStore = stores.length === 1;

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const availableStoreCountries = [...new Set(stores.map((s) => s.country))];
  const availableStoreCities = [...new Set(stores.map((s) => s.city))];

  const filteredCountriesOptions = branchesCountriesOptions.filter(
    (option) => availableStoreCountries.includes(option.translationName?.en),
  );

  const filteredCitiesOptions = branchesCitiesOptions.filter(
    (option) => availableStoreCities.includes(option.name),
  );

  const createStoreLabel = (store) => {
    const display_name = (currentLanguage === 'ar' ? store.display_name_ar : store.display_name_en) || store.name;
    return (
      <>
        <span>
          <strong>{t('delivery.pickupLocation')}</strong>
          {`: ${display_name}`}
        </span>
        {store?.link && (
          /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
          <span
            className="link"
            onClick={() => window.open(store?.link, '_blank')}
          >
            <LinkIcon className="link-icon" />
          </span>
        )}
      </>
    );
  };

  useEffect(() => {
    if (shipmentOption === 'pickup' && singleStore) {
      dispatch(setSelectedStore(stores[0].id));
    }
  }, [stores]);

  if (singleStore) {
    return (
      <>
        <Text className="checkout-step__heading" type="headline3">
          {t('delivery.singleStore')}
        </Text>
        <div className="checkout__store-pick">
          <Text type="body2">{createStoreLabel(stores[0])}</Text>
        </div>
        <OrderPackagesList packages={packages} />
      </>
    );
  }

  if (moreThanOneStore) {
    return (
      <>
        <Text className="checkout-step__heading" type="headline3">
          {t('delivery.storeSelect')}
        </Text>
        <div className="pickup-custom-selector">
          <CustomSelect
            subLabel="Country"
            value={selectedCountry}
            options={filteredCountriesOptions}
            setValue={(value) => setSelectedCountry(value)}
          />
        </div>
        {selectedCountry
        && (
          <div className="pickup-custom-selector">
            <CustomSelect
              subLabel="City"
              value={selectedCity}
              options={filteredCitiesOptions.filter((city) => city.country.includes(selectedCountry))}
              setValue={(value) => setSelectedCity(value)}
            />
          </div>
        )}
        {selectedCity
        && (
          <div className="pickup-custom-selector">
            <CustomSelect
              inputName="store"
              options={stores
                .filter((store) => store.city.toLowerCase() === selectedCity.toLowerCase())
                .map((store) => ({
                  id: `${store.id}`,
                  value: store.id,
                  name: createStoreLabel(store),
                }))}
              value={selectedStore}
              defaultValueLabel={t('delivery.selectPlaceholder')}
              setValue={(value, e, option) => {
                dispatch(setSelectedStore(option.id));
              }}
            />
          </div>
        )}
        {selectedStore !== 'none' && <OrderPackagesList packages={packages} />}
      </>
    );
  }

  return null;
};
