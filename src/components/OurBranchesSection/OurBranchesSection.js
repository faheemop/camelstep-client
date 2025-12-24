import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { CustomSelect } from '../inputs/CustomSelect/CustomSelect';
import {
  mapCenter, mapContainerStyle, customMapIcon,
} from '../../utils/branchesLocation';
import { API_ROOT, GOOGLE_MAP_API_KEY } from '../../config';
import MarkerIcon from '../../assets/icons/marker.svg';
import './OurBranchesSection.scss';

export const OurBranchesSection = ({ branchesProp, locations }) => {
  const { t, i18n } = useTranslation('application');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    language: i18n.language,
  });

  const mapRef = useRef();
  const branchCardRefs = useRef([]);

  const [newBranchLocations, setNewBranchLocations] = useState([]);
  const [newBranchCityOptions, setNewBranchCityOptions] = useState([]);
  const [newBranchCountryOptions, setNewBranchCountryOptions] = useState([]);

  const [newMapState, setNewMapState] = useState({
    selectedLocation: mapCenter,
    branchesData: [],
    selectedCountry: 'saudia',
    selectedCity: 'all',
    cityList: [],
  });

  useEffect(() => {
    if (locations && locations.length > 0) {
      const tempBranchLocations = [];
      const tempCityOptions = [
        {
          id: 1,
          name: 'All',
          value: 'all',
          country: 'saudia, uae',
          translationName: {
            en: 'All',
            ar: 'الجميع',
          },
        },
      ];

      const tempCountryOptions = [
        {
          id: 1,
          name: 'All',
          value: 'all',
          translationName: {
            en: 'All',
            ar: 'الجميع',
          },
        },
      ];

      locations.forEach((location, index) => {
        const branchLocation = {
          lat: location?.la ?? 21.4238776313303,
          lng: location?.lng ?? 39.873678742327165,
          label: {
            en: location?.display_name || 'Camel Step',
            ar: location?.display_name_ar || 'خطوة جمل',
          },
          address: {
            en: `${location?.street ?? ''} ${location?.street2 ?? ''}`.trim(),
            ar: `${location?.street_ar ?? ''} ${location?.street2_ar ?? ''}`.trim(),
          },
          imgUrl: `${API_ROOT}${location?.cover_image_url}`,
          images: [`${API_ROOT}${location?.cover_image_url}`],
          city: location?.city?.toLowerCase() || 'unknown',
          country: location?.country === 'Saudi Arabia' ? 'saudia' : 'uae',
          branchLink: location?.link || 'https://maps.app.goo.gl/u8othMQQg3eoW3Rv5',
        };

        tempBranchLocations.push(branchLocation);

        const cityOption = {
          id: index + 2,
          name: location?.city || 'City',
          value: location?.city?.toLowerCase() || 'city',
          country: location?.country === 'Saudi Arabia' ? 'saudia' : 'uae',
          translationName: {
            en: location?.city || 'City',
            ar: location?.city_ar || 'مدينة',
          },
        };

        if (
          !tempCityOptions.some(
            (tco) =>
              tco.value === cityOption.value &&
              tco.country === cityOption.country
          )
        ) {
          tempCityOptions.push(cityOption);
        }

        const countryOption = {
          id: index + 2,
          name: location?.country || 'Country',
          value: location?.country === 'Saudi Arabia' ? 'saudia' : 'uae',
          translationName: {
            en: location?.country || 'Country',
            ar: location?.country_ar || 'دولة',
          },
        };

        if (
          !tempCountryOptions.some((tco) => tco.value === countryOption.value)
        ) {
          tempCountryOptions.push(countryOption);
        }
      });

      setNewBranchLocations(tempBranchLocations);
      setNewBranchCityOptions(tempCityOptions);
      setNewBranchCountryOptions(tempCountryOptions);

      setNewMapState({
        selectedLocation: mapCenter,
        branchesData: tempBranchLocations.filter(
          (branch) => branch.country === 'saudia'
        ),
        selectedCountry: 'saudia',
        selectedCity: 'all',
        cityList: tempCityOptions.filter((city) =>
          city.country.includes('saudia')
        ),
      });
    }
  }, [locations]);

  const handleButtonClick = (location) => {
    if (newMapState.selectedLocation === location) {
      setNewMapState({
        ...newMapState,
        selectedLocation: mapCenter,
      });
      mapRef.current.panTo(mapCenter);
    } else {
      setNewMapState({
        ...newMapState,
        selectedLocation: location,
      });
      mapRef.current.panTo(location);
    }
  };

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    mapRef.current.setCenter(mapCenter);
  }, [mapRef]);

  const countrySelectHandler = (value) => {
    const selectCountry = value;
    if (selectCountry === 'all') {
      setNewMapState({
        ...newMapState,
        branchesData: newBranchLocations,
        selectedCountry: selectCountry,
        selectedCity: 'all',
      });
      return;
    }
    const updatedBranchList = newBranchLocations.filter((branch) => branch.country === selectCountry);
    const updatedCitiesList = newBranchCityOptions.filter((city) => city.country.includes(selectCountry));
    setNewMapState({
      ...newMapState,
      branchesData: updatedBranchList,
      selectedCountry: selectCountry,
      cityList: updatedCitiesList,
      selectedCity: 'all',
    });
  };

  const citySelectHandler = (value) => {
    const selectCity = value;

    if (selectCity === 'all') {
      const updatedBranchList = newBranchLocations.filter((branch) => branch.country === newMapState.selectedCountry);
      setNewMapState({
        ...newMapState,
        branchesData: updatedBranchList,
        selectedCity: selectCity,
      });
      return;
    }

    const updatedBranchList = newBranchLocations.filter((branch) => branch.city === selectCity);
    setNewMapState({
      ...newMapState,
      branchesData: updatedBranchList,
      selectedCity: selectCity,
    });
  };

  const countryLabel = t('mapSection.country');
  const cityLabel = t('mapSection.city');

  const handleMarkerClick = (e, location, index) => {
    setNewMapState({
      ...newMapState,
      selectedLocation: location,
    });
    const branchRef = branchCardRefs.current[index];
    if (branchRef) {
      branchRef.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const setBranchRef = (el, index) => {
    branchCardRefs.current[index] = el;
  };

  return (
    <div>
      {isLoaded
        && (
          <div className="map-section-wrapper" id="our-branches-section">
            <div className={`map-section-container ${!branchesProp ? '' : 'no-top-margin'}`} id="our-branches-section">
              {
                !branchesProp && <p className="section-label">{t('mapSection.title')}</p>
              }
              <div className="map-data-container">
                <div className="branches-section">
                  <div className="branches-filter-container">
                    <div className="custom-select-wrapper">
                      <CustomSelect
                        subLabel={newMapState.selectedCountry === 'all' ? countryLabel : null}
                        value={newMapState.selectedCountry}
                        options={newBranchCountryOptions}
                        setValue={countrySelectHandler}
                      />
                    </div>
                    {newMapState.selectedCountry !== 'all'
                      && (
                        <div className="custom-select-wrapper">
                          <CustomSelect
                            subLabel={newMapState.selectedCity === 'all' ? cityLabel : null}
                            value={newMapState.selectedCity}
                            options={newMapState.cityList}
                            setValue={citySelectHandler}
                          />
                        </div>
                      )}
                  </div>
                  <div className="branches-container">
                    {newMapState.branchesData.map((branch, index) => (
                      <BranchCard
                        index={index}
                        branch={branch}
                        handleButtonClick={handleButtonClick}
                        selectedLocation={newMapState.selectedLocation}
                        branchRef={(e) => setBranchRef(e, index)}
                      />
                    ))}
                  </div>
                </div>
                <div className="map-container">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={6}
                    onLoad={handleMapLoad}
                  >
                    {newMapState.branchesData.map((branch, index) => (
                      <Marker key={index} position={branch} icon={newMapState.selectedLocation === branch ? customMapIcon : undefined} onClick={(e) => handleMarkerClick(e, branch, index)} />
                    ))}
                  </GoogleMap>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export const BranchCard = ({
  index, handleButtonClick, branch, selectedLocation, branchRef,
}) => {
  const { i18n } = useTranslation('application');
  const label = i18n.language === 'en' ? branch.label.en : branch.label.ar;
  const address = i18n.language === 'en' ? branch.address.en : branch.address.ar;
  return (
    <button
      type="button"
      key={index}
      onClick={() => handleButtonClick(branch)}
      className={`branch-wrapper ${selectedLocation === branch && 'branch-selected'} ${i18n.language === 'en' ? 'branch-wrapper-border-en' : 'branch-wrapper-border-ar'}`}
      ref={branchRef}
    >
      <img src={branch.imgUrl} alt="camel step branch" className="branch-image" />
      <div className="branch-details">
        <p className="branch-name">{label}</p>
        <div className="branch-address-container">
          <div className="marker-container">
            <span className="marker-icon">
              <MarkerIcon className={`marker-icon-svg ${selectedLocation === branch && 'marker-selected'}`} />
            </span>
          </div>
          <div className="address-label-container">
            <a href={branch.branchLink} target="_blank" rel="noopener noreferrer">
              <p className="branch-address">{address}</p>
            </a>
          </div>
        </div>
      </div>
    </button>
  );
};
