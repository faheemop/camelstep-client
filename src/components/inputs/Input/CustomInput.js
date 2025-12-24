import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from './Input';

export const CustomInput = ({ name, label, validation }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({ field }) => (
        <Input
          name={name}
          label={label}
          error={errors[name]?.message}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
};
