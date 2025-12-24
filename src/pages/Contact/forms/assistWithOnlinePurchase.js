import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import snakecaseKeys from 'snakecase-keys';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FormTextInput } from '../../../components/FormFields/FormTextInput';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import { Button } from '../../../components/common/Button/Button';
import { Text } from '../../../components/Text/Text';
import { handleApiRequest, resolveTypeToApiEndpoint } from './formHelpers';

export const AssistWithOnlinePurchase = ({ answers, setSubmitted, options }) => {
  const { i18n, t } = useTranslation('application');
  const [locked, setLocked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleFocused = () => setIsFocused((state) => !state);

  const ORDER_ISSUES = [
    { value: 'change_of_mind', label: t('contact.online_assistance.options.change_of_mind') },
    { value: 'delivery_delays', label: t('contact.online_assistance.options.delivery_delays') },
    { value: 'incorrect_item', label: t('contact.online_assistance.options.incorrect_item_ordered') },
    { value: 'modify_order', label: t('contact.online_assistance.options.modify_order') },
    { value: 'duplicate_purchase', label: t('contact.online_assistance.options.duplicate_purchase') },
    { value: 'other', label: t('contact.online_assistance.options.other') },
  ];

  const formValidationSchema = Yup.object().shape({
    name: Yup.string().required(t('forms.fullName.requiredMsg')),
    phoneNumber: Yup.number()
      .typeError(t('forms.phoneNumber.validationMsg'))
      .required(t('forms.phoneNumber.requiredMsg')),
    email: Yup.string().email(t('forms.email.validationMsg')).required(t('forms.email.requiredMsg')),
    body: Yup.string(),
    city: Yup.string(),
    ...(answers.type === 'other' || answers.type === 'order_cancellation' ? {
      orderId: Yup.string().required(t('contact.fields.order_id.required')),
      cancellation_reason: Yup.string().required(t('contact.online_assistance.reason_of_cancellation.requiredMsg')),
    } : {
      country: Yup.string().required(t('forms.country.requiredMsg')),
    }),
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
        body: answers?.body || '',
        country: answers?.country || '',
        orderId: '',
        issueType: '',
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values) => onFormSubmit(values)}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ values, errors }) => {
        const charactersLeft = 1000 - values.body.length;
        return (
          <Form>
            <FormTextInput type="text" name="name" label={t('contact.fields.name.label')} />
            <FormTextInput type="text" name="phoneNumber" label={t('contact.fields.number.label')} />
            {answers.type === 'other' || answers.type === 'order_cancellation' ? (
              <>
                <FormTextInput type="text" name="orderId" label={t('contact.fields.order_id.label')} />
                <FormSearchableSelect name="cancellation_reason" options={ORDER_ISSUES} placeholder={t('contact.online_assistance.reason_of_cancellation.label')} />
              </>
            )
              : (
                <>
                  <FormSearchableSelect name="country" options={options} placeholder={t('forms.country.label')} />
                  <FormTextInput
                    type="text"
                    name="city"
                    label={t('forms.city.label')}
                  />
                </>
              )}
            <FormTextInput type="email" name="email" label={t('contact.fields.email.label')} />
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
