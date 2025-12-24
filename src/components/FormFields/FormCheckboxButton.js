import { useField } from 'formik';
import React from 'react';
import { CheckboxButton } from '../inputs/checkboxButton/CheckboxButton';

/* eslint-disable react/jsx-props-no-spreading */
export const FormCheckboxButton = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const isErrror = meta.touched && meta.error ? meta.error : null;

  return (
    <CheckboxButton error={isErrror} {...field} {...props} />
  );
};
