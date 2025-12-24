import React, { useEffect, useState } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Col, Row } from "react-grid-system";
import { Button } from "../../common/Button/Button";
import { FormTextInput } from "../../FormFields/FormTextInput";
import { FormCheckboxButton } from "../../FormFields/FormCheckboxButton";
import { FormCustomCheckbox } from "../../FormFields/FormCustomCheckbox";
import { FormDynamicSearchSelect } from "../../FormFields/FormDynamicSearchSelect";
import { countriesList } from "../../../shared/countrylist";
import { zipCodeRegEx, fullNameRegex } from "../../../shared/consts";
import { useLazyGetCitySuggestionsQuery } from "../../../services/fetchCities";
import { getCityList } from "../../../helpers/getCityHelper";
import "./addressForm.scss";

export const maxAddressLength = 45;

export const AddressForm = ({
  onEditCancel,
  onFormSubmit,
  full_name,
  phone,
  email,
  address_line_1,
  address_line_2,
  city,
  country,
  zipcode,
  purpose,
  isDefault,
}) => {
  const { t } = useTranslation("application", { keyPrefix: "forms" });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [cityInput, setCityInput] = useState(city);

  const [trigger, { data: citySuggestions }] = useLazyGetCitySuggestionsQuery();

  const formValidationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(t("fullName.requiredMsg"))
      .min(3, t("fullName.validationMsg.short"))
      .matches(fullNameRegex, t("fullName.validationMsg.specialCharacters")),
    phone: Yup.number()
      .typeError(t("phoneNumber.validationMsg"))
      .required(t("phoneNumber.requiredMsg")),
    email: Yup.string()
      .email(t("email.validationMsg"))
      .required(t("email.requiredMsg")),
    addressline1: Yup.string()
      .required(t("addressline1.requiredMsg"))
      .max(maxAddressLength, t("addressline1.toLong")),
    addressline2: Yup.string()
      .required(t("addressline2.requiredMsg"))
      .max(maxAddressLength, t("addressline2.toLong")),
    country: Yup.string().required(t("country.requiredMsg")),
    city: Yup.string().required(t("city.requiredMsg")),
    zipcode: Yup.string()
      .matches(zipCodeRegEx, t("zip.validationMsg"))
      .required(t("zip.requiredMsg")),
    purpose: Yup.string().required(t("addressPurpose.requiredMsg")),
  });

  const handleCityValue = (value) => {
    setCityInput(value);
  };

  const handleCountryChange = async (countryName, setFieldValue) => {
    if (!countryName) return;
    setSelectedCountry(countryName);
    handleCityValue("");
    setFieldValue("city", "");
    trigger({
      inputValue: "a",
      countryCode: countryName.isoCode,
    });
  };

  const handleCityInputChange = async (inputValue) => {
    handleCityValue(inputValue);
  };

  useEffect(() => {
    if (cityInput) {
      trigger({
        inputValue: cityInput,
        countryCode: selectedCountry.isoCode,
      });
    }
  }, [cityInput]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        fullName: full_name || "",
        phone: phone || "",
        email: email || "",
        addressline1: address_line_1 || "",
        addressline2: address_line_2 || "",
        city: city || "",
        country: country || "",
        zipcode: zipcode || "",
        purpose: purpose || "",
        isDefault: isDefault || false,
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values, formikObj) => onFormSubmit(values, formikObj)}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ values, errors, setFieldValue }) => (
        <Form>
          <div className="form__address-purpose">
            {/* <FormCheckboxButton
              text={t('addressPurpose.billing')}
              type="radio"
              currentValue={values.purpose}
              name="purpose"
              value="billing"
              id="address-biling"
            /> */}
            <FormCheckboxButton
              text={t("addressPurpose.shipping")}
              type="radio"
              currentValue={values.purpose}
              name="purpose"
              value="shipping"
              id="address-shipping"
            />
            {/* <FormCheckboxButton
              text={t("addressPurpose.gift")}
              type="radio"
              currentValue={values.purpose}
              name="purpose"
              value="gift"
              id="address-gift"
            /> */}
            <ErrorMessage
              name="purpose"
              component="span"
              className="custom-input__error-msg"
            />
          </div>
          <FormTextInput
            type="text"
            name="fullName"
            label={t("fullName.label")}
          />
          <FormTextInput
            type="text"
            name="phone"
            label={t("phoneNumber.label")}
          />
          <FormTextInput type="text" name="email" label={t("email.label")} />
          <div className={`fields-group ${errors?.root ? "error" : ""}`}>
            <FormTextInput
              type="text"
              name="addressline1"
              label={t("addressline1.label")}
              maxLength={maxAddressLength}
            />
            <FormTextInput
              type="text"
              name="addressline2"
              label={t("addressline2.label")}
              maxLength={maxAddressLength}
            />
            <Row>
              <Col xs={12} md={4}>
                <FormDynamicSearchSelect
                  name="country"
                  options={countriesList}
                  placeholder={t("country.label")}
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
                  placeholder={t("city.label")}
                  menuPlacement="top"
                  inputValue={cityInput}
                  onInputChange={handleCityInputChange}
                />
              </Col>
              <Col xs={12} md={4}>
                <FormTextInput
                  type="text"
                  name="zipcode"
                  label={t("zip.label")}
                />
              </Col>
              {errors?.root && (
                <Col xs={12}>
                  <p className="form__error-msg">{errors.root}</p>
                </Col>
              )}
            </Row>
          </div>
          <FormCustomCheckbox label="Set as default" name="isDefault" />
          <div className="form-actions">
            <Button
              className="form__submit-btn"
              type="primary"
              inverted
              onClick={() => onEditCancel(false)}
              text={t("cancel")}
            />
            <Button
              className="form__submit-btn"
              type="primary"
              buttonType="submit"
              text={t("save")}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
