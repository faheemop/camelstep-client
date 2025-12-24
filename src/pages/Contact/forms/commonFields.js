import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import snakecaseKeys from 'snakecase-keys';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FormTextInput } from '../../../components/FormFields/FormTextInput';
import { Button } from '../../../components/common/Button/Button';
import { Text } from '../../../components/Text/Text';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import {
  handleApiRequest,
} from './formHelpers';

export const CommonFields = ({
  setSubmitted, answers, resume, invoiceRef, photoRef, options,
}) => {
  const { i18n, t } = useTranslation('application');
  const [isFocused, setIsFocused] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const toggleFocused = () => setIsFocused((state) => !state);

  /**
   * @param city
   */
  function checkCity(city) {
    if (city.length === 0) return false;
    if (city.toLowerCase().startsWith('r')) return city.toLowerCase() === 'riyadh';
    return city.toLocaleLowerCase() === 'الرياض';
  }

  const formValidationSchema = Yup.object().shape({
    name: Yup.string().required(t('forms.fullName.requiredMsg')),
    email: Yup.string().email(t('forms.email.validationMsg')).required(t('forms.email.requiredMsg')),
    phoneNumber: Yup.number()
      .typeError(t('forms.phoneNumber.validationMsg'))
      .required(t('forms.phoneNumber.requiredMsg')),
    country: Yup.string().required(t('forms.country.requiredMsg')),
    city: Yup.string().required(t('forms.city.requiredMsg')),
    body: Yup.string().required(t('forms.body.requiredMsg')),
  });

  /**
   * @param msgSubject
   */
  function resolveTypeToApiEndpoint(msgSubject) {
    switch (msgSubject) {
      case 'career_request':
        return 'career';
      case 'maintenance':
        return 'maintenance';
      case 'complaint':
        return 'suggestions';
      default:
        return 'corporate_partners';
    }
  }

  /**
   * @param data
   * @param field
   * @param file
   */
  function checkIfNoAttachment(data, field, file) {
    if (data[field]) {
      // eslint-disable-next-line immutable/no-mutation
      return {
        ...data,
        [field]: file,
      };
    }
    const { [field]: emptyField, ...restOfData } = data;
    return restOfData;
  }

  const onFormSubmit = (values) => {
    setLocked(true);

    const data = {
      ...answers,
      ...values,
    };

    let rawData = snakecaseKeys(data);
    rawData = checkIfNoAttachment(rawData, 'resume', resume);
    rawData = checkIfNoAttachment(rawData, 'invoice_attachment', invoiceRef);
    rawData = checkIfNoAttachment(rawData, 'problem_photo', photoRef);
    handleApiRequest(resolveTypeToApiEndpoint(answers.msgSubject), rawData, setSubmitted, t, i18n.language);
  };

  const sendDisabled = showNote && answers.msgSubject === 'maintenance';

  return (
    <Formik
      initialValues={{
        name: answers?.name || '',
        email: answers?.email || '',
        phoneNumber: answers?.phoneNumber || '',
        country: answers?.country || '',
        city: answers?.city || '',
        body: answers?.body || '',
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values) => onFormSubmit(values)}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ values, errors, handleChange }) => {
        const charactersLeft = 1000 - values.body.length;
        return (
          <Form>
            <FormTextInput type="text" name="name" label={t('forms.fullName.label')} />
            <FormTextInput type="text" name="email" label={t('forms.email.label')} />
            <FormTextInput type="tel" name="phoneNumber" label={t('forms.phoneNumber.label')} />
            <FormSearchableSelect name="country" options={options} placeholder={t('forms.country.label')} />
            <FormTextInput
              type="text"
              name="city"
              label={t('forms.city.label')}
              onChange={(e) => {
                handleChange(e);
                // eslint-disable-next-line immutable/no-mutation
                setShowNote(checkCity(e.target.value));
              }}
            />
            {sendDisabled && (
              <p className="city-note" type="caption">{t('contact.citynote')}</p>
            )}
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
