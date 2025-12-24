import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import snakecaseKeys from 'snakecase-keys';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FormTextInput } from '../../../components/FormFields/FormTextInput';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import { FormCustomCheckbox } from '../../../components/FormFields/FormCustomCheckbox';
import { Button } from '../../../components/common/Button/Button';
import { Text } from '../../../components/Text/Text';
import {
  handleApiRequest, resolveTypeToApiEndpoint,
} from './formHelpers';

export const BusinessSalesForm = ({
  answers, setSubmitted, options,
}) => {
  const { i18n, t } = useTranslation('application');
  const [locked, setLocked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleFocused = () => setIsFocused((state) => !state);

  const formValidationSchema = Yup.object().shape({
    name: Yup.string().required(t('contact.fields.name.required')),
    phoneNumber: Yup.number()
      .typeError(t('forms.phoneNumber.validationMsg'))
      .required(t('forms.phoneNumber.requiredMsg')),
    email: Yup.string().email(t('forms.email.validationMsg')).required(t('forms.email.requiredMsg')),
    country: Yup.string().required(t('forms.country.requiredMsg')),
    crNumber: Yup.string().when('country', {
      is: 'Saudi Arabia',
      then: (schema) => (answers.type === 'request_quotation'
        ? schema.required(t('contact.fields.cr.required'))
        : schema.notRequired()),
      otherwise: (schema) => schema.notRequired(),
    }),
    vatNumber: Yup.string().when('country', {
      is: 'Saudi Arabia',
      then: (schema) => (answers.type === 'request_quotation'
        ? schema.required(t('contact.fields.vat.required'))
        : schema.notRequired()),
      otherwise: (schema) => schema.notRequired(),
    }),
    companyName: Yup.string().required(t('contact.fields.company_name.required')),
  });

  const onFormSubmit = (values) => {
    setLocked(true);
    const data = { ...answers, ...values };
    const rawData = snakecaseKeys(data);
    handleApiRequest(resolveTypeToApiEndpoint(answers.msgSubject), rawData, setSubmitted, t, i18n.language);
  };

  return (
    <Formik
      initialValues={{
        name: answers?.name || '',
        phoneNumber: answers?.phoneNumber || '',
        email: answers?.email || '',
        country: answers?.country || '',
        city: answers?.city || '',
        crNumber: '',
        vatNumber: '',
        companyName: '',
        body: '',
        quotationType: '',
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values) => onFormSubmit(values)}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({
        values, errors,
      }) => {
        const charactersLeft = 1000 - values.body.length;
        return (
          <Form>
            {answers.type === 'request_quotation' && (
            <>
              <FormCustomCheckbox name="quotationType" label={t('contact.business_sales_checkboxes.coffee_beans')} value="coffee_beans" />
              <FormCustomCheckbox name="quotationType" label={t('contact.business_sales_checkboxes.tools_and_equipments')} value="tools_and_equipments" />
              <FormCustomCheckbox name="quotationType" label={t('contact.business_sales_checkboxes.both')} value="both" />
            </>
            )}
            <FormTextInput type="text" name="name" label={t('contact.fields.name.label')} />
            <FormTextInput type="text" name="phoneNumber" label={t('contact.fields.number.label')} />
            <FormSearchableSelect
              name="country"
              options={options}
              placeholder={t('forms.country.label')}
            />
            <FormTextInput type="text" name="city" label={t('forms.city.label')} />
            <FormTextInput type="text" name="companyName" label={t('contact.fields.company_name.label')} />
            <FormTextInput type="email" name="email" label={t('contact.fields.email.label')} />
            {answers.type === 'request_quotation' && values.country === 'Saudi Arabia' && (
            <>
              <FormTextInput type="text" name="crNumber" label={t('contact.fields.cr.label')} />
              <FormTextInput type="text" name="vatNumber" label={t('contact.fields.vat.label')} />
            </>
            )}
            {answers.type !== 'request_quotations' ? (
              <FormTextInput type="text" name="orderDetails" label={t('contact.fields.order_details.label')} />
            ) : (
              <div className="message-box">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                  className={classNames({
                    'message-box__text-area-container': true,
                    'message-box__text-area-container--focused': isFocused,
                  })}
                >
                  <Field
                    component="textarea"
                    name="body"
                    onFocus={toggleFocused}
                    onBlur={toggleFocused}
                    className={classNames({
                      'message-box__text-area': true,
                      'message-box__text-area--focused': isFocused,
                    })}
                    maxLength={1000}
                  />
                  <span className="message-box__label">
                    {t('contact.body.label')}
                    {' '}
                    {}
                  </span>
                </label>
                <Text
                  type="caption"
                  className={classNames({
                    'message-box__characters-counter': true,
                    'message-box__characters-counter--focused': isFocused,
                    'message-box__characters-counter--full': charactersLeft === 0,
                  })}
                >
                  {charactersLeft}
                  {' '}
                  {t('orderFeedback.charactersLeft')}
                </Text>
                {errors.body && <span className="custom-input__error-msg">{errors.body}</span>}
              </div>
            )}
            <div className="form-actions">
              <Button
                disabled={locked}
                className="form__submit-btn"
                type="primary"
                buttonType="submit"
                text={locked ? t('forms.sending') : t('forms.send')}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
