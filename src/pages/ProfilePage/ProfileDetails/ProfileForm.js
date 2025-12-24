/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-grid-system';
import { Text } from '../../../components/Text/Text';
import { Alert } from '../../../components/common/Alert/Alert';
import { Button } from '../../../components/common/Button/Button';
import { CustomInput } from '../../../components/inputs/Input/CustomInput';
import { getProfileFormFields } from '../../../utils/profileForm';
import './ProfileForm.scss';

export const ProfileForm = ({
  onSubmit,
  firstName = '',
  lastName = '',
  email = '',
  initialPhoneNumber = '',
  error,
  formStatus,
}) => {
  const { t } = useTranslation('application');
  const methods = useForm({
    defaultValues: {
      firstName,
      lastName,
      email,
      phoneNumber: initialPhoneNumber,
    },
    mode: 'onChange',
  });

  const {
    handleSubmit, formState: { isDirty, isValid },
  } = methods;

  const fields = getProfileFormFields(t);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text type="headline3" className="form-text-top">
          {t('profile.nav.details')}
        </Text>
        <Row>
          {fields.slice(0, 2).map((field) => (
            <Col key={field.name}>
              <CustomInput
                name={field.name}
                label={field.label}
                validation={field.validation}
              />
            </Col>
          ))}
        </Row>
        <Row>
          {fields.slice(2).map((field) => (
            <Col key={field.name}>
              <Text type="headline3" className="form-text">
                {field.heading}
              </Text>
              <CustomInput
                name={field.name}
                label={field.label}
                validation={field.validation}
              />
            </Col>
          ))}
        </Row>
        <Button
          className="form__submit-btn"
          type="primary"
          buttonType="submit"
          text={t('forms.save')}
          disabled={!isValid || !isDirty}
        />
        {error && <Alert type="danger">{error}</Alert>}
        {formStatus.type && <Alert type={formStatus.type}>{formStatus.message}</Alert>}
      </form>
    </FormProvider>
  );
};
