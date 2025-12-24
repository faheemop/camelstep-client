import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FormTextInput } from '../../../components/FormFields/FormTextInput';
import { FormSearchableSelect } from '../../../components/FormFields/FormSearchableSelect';
import FileIcon from '../../../assets/icons/file.svg';

import { FormCustomCheckbox } from '../../../components/FormFields/FormCustomCheckbox';
import {
  checkFileFormat, SUPPORTED_DOCS, FILE_SIZE, SUPPORTED_IMAGES,
} from './formHelpers';
import { SubmitButton } from './selectSubject';

export const MaintenanceFields = ({
  answers, setAnswers, nextStep, options, invoiceRef, photoRef,
}) => {
  const { t } = useTranslation('application');

  const formValidationSchema = Yup.object().shape({
    productType: Yup.string().required(t('contact.producttype.requiredMsg')),
    productName: Yup.string().required(t('forms.productname.requiredMsg')),
    purchasingDate: Yup.date()
      .required(t('forms.purchasingdate.requiredMsg'))
      .max(new Date(), t('forms.purchasingdate.pastOrTodayMsg')),
    maintenanceType: Yup.string().required(t('contact.maintenancetype.requiredMsg')),
    invoiceAttachment: Yup.mixed().when([], {
      is: () => !invoiceRef.current,
      then: Yup.mixed().test('isRequired', t('forms.file.requiredMsg'), (value) => Boolean(value))
        .test('fileSize', t('forms.file.validationMsg.size'), () => (invoiceRef.current?.size && invoiceRef.current.size <= FILE_SIZE))
        .test('fileType', t('forms.file.validationMsg.type'), () => checkFileFormat(invoiceRef.current)),
      otherwise: Yup.mixed().notRequired(),
    }),
    problemPhoto: Yup.mixed().when([], {
      is: () => !photoRef.current,
      then: Yup.mixed().test('isRequired', t('forms.photo.requiredMsg'), (value) => Boolean(value))
        .test('photoSize', t('forms.photo.validationMsg.size'), () => (photoRef.current?.size && photoRef.current.size <= FILE_SIZE))
        .test('photoType', t('forms.photo.validationMsg.type'), () => checkFileFormat(photoRef.current, true)),
      otherwise: Yup.mixed().notRequired(),
    }),
  });

  return (
    <Formik
      initialValues={{
        productType: answers?.productType || '',
        productName: answers?.productName || '',
        camelStepPurchase: answers?.camelStepPurchase || false,
        invoiceNumber: answers?.invoiceNumber || '',
        purchasingDate: answers?.purchasingDate || '',
        maintenanceType: answers?.maintenanceType || '',
        serialNumber: answers?.serialNumber || '',
        companyName: answers?.companyName || '',
        invoiceAttachment: '',
        problemPhoto: '',
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
      validateOnChange={false}
    >
      {({ values, handleChange }) => (
        <Form>
          <FormSearchableSelect name="productType" options={options[0]} placeholder={t('contact.producttype.label')} />
          <FormTextInput type="text" name="productName" label={t('forms.productname.label')} />
          <FormCustomCheckbox
            name="camelStepPurchase"
            label={t('contact.storepurchase')}
            defaultChecked={values.camelStepPurchase}
          />
          <FormTextInput type="text" name="invoiceNumber" label={t('forms.invoicenumber.label')} />
          <FormTextInput type="date" name="purchasingDate" label={t('forms.purchasingdate.label')} />
          <FormSearchableSelect name="maintenanceType" options={options[1]} placeholder={t('contact.maintenancetype.label')} />
          <FormTextInput type="text" name="companyName" label={t('forms.company.label')} />
          <FormTextInput
            type="file"
            name="invoiceAttachment"
            id="invoiceAttachment"
            accept={SUPPORTED_DOCS.map((el) => `.${el}`).join(',')}
            label={(
              <>
                <strong>{t('forms.file.label2')}</strong>
                {' '}
                <span>{t('forms.file.labelinfo')}</span>
              </>
            )}
            onChange={(e) => {
              handleChange(e);
              const [file] = e.target.files;
              // eslint-disable-next-line immutable/no-mutation, no-param-reassign
              invoiceRef.current = file;
            }}
            customWrapperClass="file-input-wrapper"
            icon={<FileIcon />}
            fileRef={invoiceRef.current}
          />
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
          <FormTextInput type="text" name="serialNumber" label={t('forms.serialnumber.label')} />
          <SubmitButton />
        </Form>
      )}
    </Formik>
  );
};
