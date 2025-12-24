import { useField } from 'formik';
import React from 'react';
import { CustomCheckbox } from '../inputs/CustomCheckbox/CustomCheckbox';

/* eslint-disable react/jsx-props-no-spreading */
export const FormCustomCheckbox = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const isErrror = meta.touched && meta.error ? meta.error : null;

  return (
    <CustomCheckbox error={isErrror} {...field} {...props} label={label} />
  );
};
