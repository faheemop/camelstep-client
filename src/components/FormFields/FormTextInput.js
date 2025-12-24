import { useField } from 'formik';
import React from 'react';
import { Input } from '../inputs/Input/Input';
import { MaskedInput } from '../inputs/Input/MaskedInput';

/* eslint-disable react/jsx-props-no-spreading */
export const FormTextInput = ({
  label, mask = false, maskPlaceholder, ...props
}) => {
  const [field, meta] = useField(props);

  const isErrror = meta.touched && meta.error ? meta.error : null;

  return mask
    ? (
      <MaskedInput mask={mask} maskPlaceholder={maskPlaceholder} label={label} error={isErrror} {...field} {...props} />
    ) : (
      <Input label={label} error={isErrror} {...field} {...props} />
    );
};
