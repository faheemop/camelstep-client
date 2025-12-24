import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FormTextInput } from '../../../components/FormFields/FormTextInput';
import FileIcon from '../../../assets/icons/file.svg';
import {
  checkFileFormat, SUPPORTED_DOCS, FILE_SIZE,
} from './formHelpers';
import { SubmitButton } from './selectSubject';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import { FormCustomCheckbox } from '../../../components/FormFields/FormCustomCheckbox';

export const CareersFields = ({
  answers, setAnswers, nextStep, resume, options,
}) => {
  const { t } = useTranslation('application');

  const MIN_AGE = 18;
  const MAX_AGE = 60;

  const formValidationSchema = Yup.object().shape({
    nationality: Yup.string().required(t('forms.nationality.requiredMsg')),
    age: Yup.number().min(MIN_AGE, t('forms.age.validationMsg.young')).max(MAX_AGE, t('forms.age.validationMsg.old')).required(t('forms.age.requiredMsg')),
    social_status: Yup.string().required(t('forms.status.requiredMsg')),
    education: Yup.string().required(t('forms.education.requiredMsg')),
    preferred_working_city: Yup.string().required(t('forms.preferredWorkingCity.requiredMsg')),
    diff_city_ksa: Yup.string().required(t('forms.diffCityKSA.requiredMsg')),
    resume: Yup.mixed()
      .test('isRequired', t('forms.file.requiredMsg'), (value) => Boolean(value))
      .test('fileSize', t('forms.file.validationMsg.size'), () => (resume.current?.size && resume.current.size <= FILE_SIZE))
      .test('fileType', t('forms.file.validationMsg.type'), () => checkFileFormat(resume.current)),
  });

  return (
    <Formik
      initialValues={{
        nationality: answers?.nationality || '',
        age: answers?.age || '',
        social_status: answers?.social_status || '',
        education: answers?.education || '',
        preferred_working_city: answers?.preferred_working_city || '',
        diff_city_ksa: answers?.diff_city_ksa || '',
        resume: '',
      }}
      validationSchema={formValidationSchema}
      onSubmit={(values) => {
        setAnswers((prevState) => ({
          ...prevState,
          ...values,
        }));
        nextStep(4);
      }}
      validateOnBlur={false}
    >
      {({ values, handleChange }) => (
        <Form>
          <FormSearchableSelect name="nationality" options={options[0]} placeholder={t('forms.nationality.label')} />
          <FormTextInput type="number" name="age" label={t('forms.age.label')} />
          <FormSearchableSelect name="social_status" options={options[1]} placeholder={t('forms.status.label')} />
          <FormSearchableSelect name="education" options={options[2]} placeholder={t('forms.education.label')} />
          <FormTextInput type="text" name="preferred_working_city" label={t('forms.preferredWorkingCity.label')} />
          <FormCustomCheckbox
            name="diff_city_ksa"
            label={t('forms.diffCityKSA.label')}
            defaultChecked={values.diff_city_ksa}
          />
          <FormTextInput
            type="file"
            name="resume"
            id="resume"
            accept={SUPPORTED_DOCS.map((el) => `.${el}`).join(',')}
            label={(
              <>
                <strong>{t('forms.file.label')}</strong>
                {' '}
                {t('forms.file.labelinfo')}
              </>
            )}
            onChange={(e) => {
              handleChange(e);
              const [file] = e.target.files;
              // eslint-disable-next-line immutable/no-mutation, no-param-reassign
              resume.current = file;
            }}
            customWrapperClass="file-input-wrapper"
            icon={<FileIcon />}
            fileRef={resume.current}
          />
          <SubmitButton />
        </Form>
      )}
    </Formik>
  );
};
