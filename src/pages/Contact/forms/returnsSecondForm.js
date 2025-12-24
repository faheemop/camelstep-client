/* eslint-disable react/no-this-in-sfc */
/* eslint-disable immutable/no-this */
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import snakecaseKeys from 'snakecase-keys';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FormTextInput } from '../../../components/FormFields/FormTextInput';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import { FormCustomCheckbox } from '../../../components/FormFields/FormCustomCheckbox';
import FileIcon from '../../../assets/icons/file.svg';

import {
  checkFileFormat, FILE_SIZE, checkIfNoAttachment,
  handleApiRequest,
  resolveTypeToApiEndpoint,
  SUPPORTED_IMAGES,
} from './formHelpers';
import { Button } from '../../../components/common/Button/Button';
import { Text } from '../../../components/Text/Text';

export const ReturnsFields = ({
  answers, setSubmitted, photoRef,
}) => {
  const { i18n, t } = useTranslation('application');
  const [locked, setLocked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleFocused = () => setIsFocused((state) => !state);

  const RETURN_REASONS = [
    { value: 'damaged', label: t('contact.return.reason_of_return_options.damaged_item') },
    { value: 'wrong_item', label: t('contact.return.reason_of_return_options.wrong_item') },
    { value: 'not_as_described', label: t('contact.return.reason_of_return_options.doesnt_fit') },
    { value: 'late_delivery', label: t('contact.return.reason_of_return_options.late_delivery') },
    { value: 'others', label: t('contact.return.reason_of_return_options.other') },
  ];

  const formValidationSchema = Yup.object().shape({
    name: Yup.string().required(t('forms.fullName.requiredMsg')),
    email: Yup.string().email(t('forms.email.validationMsg')).required(t('forms.email.requiredMsg')),
    invoiceNumber: Yup.string().required(t('forms.invoicenumber.requiredMsg')),
    returnReason: Yup.string().required(t('contact.return.required')),
    problemPhoto: Yup.mixed().when('returnReason', {
      is: (reason) => ['damaged', 'wrong_item', 'not_as_described'].includes(reason),
      then: Yup.mixed()
        .test('isRequired', t('forms.photo.requiredMsg'), (value) => Boolean(value))
        .test('fileSize', t('forms.photo.validationMsg.type'), () => (photoRef.current?.size && photoRef.current.size <= FILE_SIZE))
        .test('fileType', t('forms.photo.validationMsg.size'), () => checkFileFormat(photoRef.current, true)),
      otherwise: Yup.mixed().notRequired(),
    }),
    fullReturn: Yup.bool().test(
      'at-least-one-return',
      t('contact.return.required_message'),
      function (value) {
        return this.parent.fullReturn || value;
      },
    ),
    partialReturn: Yup.bool(),
  });

  const onFormSubmit = (values) => {
    setLocked(true);

    const data = {
      ...answers,
      ...values,
    };

    let rawData = snakecaseKeys(data);
    rawData = checkIfNoAttachment(rawData, 'problem_photo', photoRef.current);
    handleApiRequest(resolveTypeToApiEndpoint(answers.msgSubject), rawData, setSubmitted, t, i18n.language);
  };

  return (
    <Formik
      initialValues={{
        name: answers?.name || '',
        email: answers?.email || '',
        invoiceNumber: answers?.invoiceNumber || '',
        body: answers?.body || '',
        returnReason: answers?.returnReason || '',
        problemPhoto: '',
        fullReturn: false,
        partialReturn: false,
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values) => onFormSubmit(values)}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ values, errors, handleChange }) => {
        const charactersLeft = 1000 - values.body.length;
        console.log(errors);
        return (
          <Form>
            <div className="message-box" style={{ paddingBottom: '1rem' }}>
              <FormCustomCheckbox name="fullReturn" label={t('contact.return.full_return')} defaultChecked={values.fullReturn} />
              <FormCustomCheckbox name="partialReturn" label={t('contact.return.partial_return')} defaultChecked={values.partialReturn} />
            </div>
            <FormTextInput type="text" name="name" label={t('forms.fullName.label')} />
            <FormTextInput type="email" name="email" label={t('forms.email.label')} />
            <FormTextInput type="text" name="invoiceNumber" label={t('forms.invoicenumber.label')} />
            <div className="message-box">
              <label
                htmlFor="body"
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
            <FormSearchableSelect name="returnReason" options={RETURN_REASONS} placeholder={t('contact.return.reason_of_return')} />
            {['damaged', 'wrong_size', 'not_as_described'].includes(values.returnReason) && (
              <FormTextInput
                type="file"
                name="problemPhoto"
                id="problemPhoto"
                accept={SUPPORTED_IMAGES.map((el) => `.${el}`).join(',')}
                label={(
                  <>
                    <strong>{t('forms.photo.label')}</strong>
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
