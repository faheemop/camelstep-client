import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import { Button } from '../../../components/common/Button/Button';

export const SubmitButton = () => {
  const { t } = useTranslation('application');

  return (
    <Button buttonType="submit" type="primary">
      {t('contact.nextStep')}
    </Button>
  );
};

export const SelectSubject = ({
  answers, setAnswers, nextStep, options, name = 'msgSubject', placeholder,
}) => {
  const { t } = useTranslation('application');

  const formValidationSchema = Yup.object().shape({
    [name]: Yup.string().required(t('contact.type.requiredMsg')),
  });

  return (
    <Formik
      initialValues={{
        [name]: answers[name] || '',
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values) => {
        setAnswers((prevState) => ({
          ...prevState,
          ...values,
        }));
        const { msgSubject } = values;
        if (msgSubject === 'returns' || msgSubject === 'other_inquiries') {
          return nextStep(3);
        } return nextStep(2);
      }}
      validateOnBlur={false}
      key={name}
    >
      {() => (
        <Form>
          <FormSearchableSelect
            name={name}
            options={options}
            placeholder={placeholder}
          />
          <SubmitButton />
        </Form>
      )}
    </Formik>
  );
};
