import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Col, Row } from 'react-grid-system';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { FormTextInput } from '../FormFields/FormTextInput';
import { CustomCheckbox } from '../inputs/CustomCheckbox/CustomCheckbox';
import { Button } from '../common/Button/Button';
import { useAddNewAddressMutation } from '../../services/order';
import { pickAddress } from '../../features/checkout/checkoutSlice';
import { eventBus } from '../../helpers/eventBus';
import { MapWrapper } from '../Map/MapWrapper';
import { FormDynamicSearchSelect } from '../FormFields/FormDynamicSearchSelect';
import { useLazyGetCitySuggestionsQuery } from '../../services/fetchCities';
import { countriesList } from '../../shared/countrylist';
import { getCityList } from '../../helpers/getCityHelper';
import { maxAddressLength } from '../Addresses/AddressForm/AddressForm';
import { zipCodeRegEx, fullNameRegex } from '../../shared/consts';
import { useGetPhoneNumberQuery, useUpdateAddressMutation } from '../../services/user';

import './checkoutNewAddressForm.scss';
import { GoogleMapWrapper } from '../GoogleMap/GoogleMapWrapper';

export const CheckoutNewAddressForm = ({
  purpose, initialValues: initValues, id, isEdit = false,
}) => {
  const { t } = useTranslation('application');
  const DEFAULT_COUNTRY = 'Saudi Arabia';
  const DEFAULT_CITY_INPUT = 'a';
  const { data: phoneNumberData } = useGetPhoneNumberQuery();

  const [selectedCountry, setSelectedCountry] = useState(
    initValues?.country || countriesList[0],
  );
  const [cityInput, setCityInput] = useState(initValues?.city);

  const [trigger, { data: citySuggestions }] = useLazyGetCitySuggestionsQuery();
  const [handleAddNewAddress] = useAddNewAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const dispatch = useDispatch();
  const [resolvedAddressLine1, setResolvedAddressLine1] = useState(
    initValues?.addressline1 || ""
  );

  const resolvedPhone = initValues?.phone || phoneNumberData?.phone_number || '';

  const formValidationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(t('forms.fullName.requiredMsg'))
      .min(3, t('forms.fullName.validationMsg.short'))
      .matches(fullNameRegex, t('forms.fullName.validationMsg.specialCharacters')),
    addressline1: Yup.string()
      .required(t('forms.addressline1.requiredMsg'))
      .max(maxAddressLength, t('addressline1.toLong')),
    addressline2: Yup.string()
      .required(t('forms.addressline2.requiredMsg'))
      .max(maxAddressLength, t('addressline2.toLong')),
    city: Yup.string().required(t('forms.city.requiredMsg')),
    country: Yup.string().required(t('forms.country.requiredMsg')),
    zipcode: Yup.string()
      .matches(zipCodeRegEx, t('forms.zip.validationMsg'))
      .required(t('forms.zip.requiredMsg')),
    purpose: Yup.string().required(t('forms.addressPurpose.requiredMsg')),
  });

  const handleCountryChange = async (countryName, setFieldValue) => {
    if (!countryName) return;
    setSelectedCountry(countryName);
    setCityInput('');
    setFieldValue('city', '');
    trigger({
      inputValue: 'a',
      countryCode: countryName.isoCode,
    });
  };

  const handleCityInputChange = async (inputValue) => {
    setCityInput(inputValue);
  };

  useEffect(() => {
    if (cityInput) {
      trigger({
        inputValue: cityInput || DEFAULT_CITY_INPUT,
        countryCode: selectedCountry.isoCode,
      });
    }
  }, [cityInput, selectedCountry]);

  useEffect(() => {
    trigger({
      inputValue: DEFAULT_CITY_INPUT,
      countryCode: 'SA',
    });
  }, []);

  const handleApiErrors = (resp, setFieldError) => {
    if (resp?.error && typeof setFieldError === 'function') {
      const { errors } = resp.error.data;
      if (errors?.base) {
        setFieldError('root', errors?.base[0]);
      } else {
        Object.keys(errors).forEach((key) => {
          setFieldError(
            key,
            t(`forms.${key === 'zipcode' ? 'zip' : key}.validationMsg`),
          );
        });
      }
      return true; // has errors
    }
    return false;
  };

  const submitForm = async (values, formikObj) => {
    const { setFieldError } = formikObj;

    const newAddress = {
      purpose: values.purpose,
      full_name: values.fullName,
      phone: values.phone,
      address_line_1: values.addressline1,
      address_line_2: values.addressline2,
      city: values.city,
      country: values.country,
      zipcode: values.zipcode,
    };

    const addressesToAdd = [
      newAddress,
    ];

    try {
      if (isEdit) {
        const resp = await updateAddress({ id, body: newAddress });
        const hasErrors = handleApiErrors(resp, setFieldError);
        if (!hasErrors) {
          eventBus.publish('modal:close');
        }
      } else {
        const results = await Promise.all(
          addressesToAdd.map((address) => handleAddNewAddress(address)),
        );

        const anyErrors = results.some((resp) => handleApiErrors(resp, setFieldError));
        if (!anyErrors) {
          results.forEach((resp) => {
            dispatch(
              pickAddress({
                type: resp.purpose,
                address: resp.id,
              }),
            );
          });
          eventBus.publish('modal:close');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    eventBus.publish('modal:close');
  };

  const handleLocationSelect = (location) => {
    const { fullAddress } = location;
    setResolvedAddressLine1(fullAddress);
  }

  return (
    <div className="checkout-new-address">
      <GoogleMapWrapper
        onLocationSelect={handleLocationSelect}
      />
      <Formik
        initialValues={{
          fullName: initValues?.fullName || '',
          phone: resolvedPhone,
          addressline1: resolvedAddressLine1,
          addressline2: initValues?.addressline2 || '',
          city: initValues?.city || '',
          country: initValues?.country || DEFAULT_COUNTRY,
          zipcode: initValues?.zipcode || '',
          purpose,
        }}
        validationSchema={formValidationSchema}
        onSubmit={(values, formikObj) => submitForm(values, formikObj)}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
      >
        {({ errors, setFieldValue }) => (
          <Form>
            <div>
              <FormTextInput
                type="text"
                name="fullName"
                label={t('forms.fullName.label')}
              />
              <FormTextInput
                type="text"
                name="phone"
                label={t('forms.phoneNumber.label')}
              />
              <div className={`fields-group ${errors?.root ? 'error' : ''}`}>
                <FormTextInput
                  type="text"
                  name="addressline1"
                  label={t('forms.addressline1.label')}
                  maxLength={maxAddressLength}
                />
                <FormTextInput
                  type="text"
                  name="addressline2"
                  label={t('forms.addressline2.label')}
                  maxLength={maxAddressLength}
                />
                <Row>
                  <Col xs={12} md={4}>
                    <FormDynamicSearchSelect
                      name="country"
                      options={countriesList}
                      placeholder={t('forms.country.label')}
                      menuPlacement="top"
                      onChange={(option) => {
                        handleCountryChange(option, setFieldValue);
                      }}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormDynamicSearchSelect
                      name="city"
                      options={getCityList(citySuggestions, cityInput)}
                      placeholder={t('forms.city.label')}
                      menuPlacement="top"
                      inputValue={cityInput}
                      onInputChange={handleCityInputChange}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormTextInput
                      type="text"
                      name="zipcode"
                      label={t('forms.zip.label')}
                    />
                  </Col>
                </Row>
                {errors?.root && (
                  <Col xs={12}>
                    <p className="form__error-msg">{errors.root}</p>
                  </Col>
                )}
              </div>
            </div>
            <div className="form-actions">
              <Button
                className="form__submit-btn"
                type="primary"
                inverted
                onClick={() => onCancel()}
                text={t('forms.cancel')}
              />
              <Button
                className="form__submit-btn"
                type="primary"
                buttonType="submit"
                text={isEdit ? t('forms.save') : t('forms.addAddress')}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
