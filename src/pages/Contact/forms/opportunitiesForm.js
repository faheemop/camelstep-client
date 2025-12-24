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
  checkFileFormat,
  checkIfNoAttachment,
  FILE_SIZE,
  handleApiRequest,
  resolveTypeToApiEndpoint,
  SUPPORTED_IMAGES,
} from './formHelpers';
import FileIcon from '../../../assets/icons/file.svg';

export const OpportunitiesSubmissionForm = ({
  setSubmitted, answers, photoRef, options,
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
    title: Yup.string().required(t('contact.fields.title.required')),
    companyName: Yup.string().required(t('contact.fields.company_name.required')),
    body: Yup.string(),
    photo: Yup.mixed().when([], {
      is: () => !photoRef.current,
      then: Yup.mixed().test('isRequired', t('forms.photo.requiredMsg'), (value) => Boolean(value))
        .test('photoSize', t('forms.photo.validationMsg.size'), () => (photoRef.current?.size && photoRef.current.size <= FILE_SIZE))
        .test('photoType', t('forms.photo.validationMsg.type'), () => checkFileFormat(photoRef.current, true)),
      otherwise: Yup.mixed().notRequired(),
    }),
  });

  const onFormSubmit = (values) => {
    setLocked(true);

    const data = {
      ...answers,
      ...values,
    };

    let rawData = snakecaseKeys(data);
    rawData = checkIfNoAttachment(rawData, 'photo', photoRef.current);
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
        companyName: answers.companyName || '',
        title: answers.title || '',
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
            <FormTextInput type="text" name="name" label={t('contact.fields.name.label')} />
            <FormTextInput type="text" name="email" label={t('contact.fields.email.label')} />
            <FormTextInput type="tel" name="phoneNumber" label={t('contact.fields.number.label')} />
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
            <FormTextInput type="text" name="companyName" label={t('forms.company.label')} />
            <FormTextInput type="text" name="title" label={t('contact.fields.title.label')} />
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
            <FormTextInput
              type="file"
              name="photo"
              id="problemPhoto"
              accept={SUPPORTED_IMAGES.map((el) => `.${el}`).join(',')}
              label={(
                <>
                  <strong>
                    {t('contact.fields.photo.label')}
                    {' '}
                  </strong>
                  {' '}
                  <span>{t('forms.photo.labelinfo')}</span>
                </>
              )}
              onChange={(e) => {
                handleChange(e);
                const [file] = e.target.files;
                // eslint-disable-next-line immutable/no-mutation, no-param-reassign
                photoRef.current = file;
              }}
              customWrapperClass="file-input-wrapper"
              icon={<FileIcon />}
              fileRef={photoRef.current}
            />
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
