import React, { useState } from 'react';

import { useField, useFormikContext } from 'formik';
/* eslint-disable import/no-unresolved */
import Select from 'react-select';
import i18next from 'i18next';
import { CustomValueContainer } from './CustomValueContainer';

import './formSearchableSelect.scss';

const customStyles = {
  valueContainer: (provided) => ({
    ...provided,
    overflow: 'visible',
  }),
  placeholder: (provided, state) => {
    const isActive = state.selectProps.isFocused || state.hasValue || state.selectProps.inputValue;
    return {
      ...provided,
      position: 'absolute',
      top: isActive ? 0 : '50%',
      transition: '300ms',
      fontSize: isActive ? '1.2rem' : '1.4rem',
      transform: 'translateY(-50%)',
      backgroundColor: isActive && '#F7F7F7',
      color: isActive ? '#373C3D' : '#9A97A4',
      display: 'inline-block',
      fontFamily: 'expo arabic',
      fontWeight: 400,
      textTransform: 'capitalize',
      padding: isActive && '0 0.5rem',
    };
  },
  menu: (provided, state) => {
    const {
      selectProps: { menuPlacement },
    } = state;
    return {
      ...provided,
      transform: `translateY(${menuPlacement === 'top' ? '-1rem' : '1rem'})`,
    };
  },
  control: () => ({
    display: 'flex',
    justifyContent: 'space-between',
  }),
};

export const FormSearchableSelect = ({
  name, options, placeholder, menuPlacement,
}) => {
  const [field, meta] = useField(name);
  const [focused, setFocused] = useState(false);
  const { setFieldValue } = useFormikContext();

  const currentLanguage = i18next.language;

  const error = meta.touched && meta.error ? meta.error : null;

  const handleBlur = () => {
    setFocused(false);

    return field.onBlur;
  };

  const formatOptionLabel = ({ label, translationName }) => (translationName ? translationName[currentLanguage] : label);

  const value = options ? options.find((option) => option.value === field.value) : '';

  return (
    <div className="custom-input-wrapper">
      <Select
        placeholder={placeholder}
        options={options}
        name={field.name}
        isFocused={focused}
        onFocus={() => setFocused(true)}
        components={{
          ValueContainer: CustomValueContainer,
        }}
        formatOptionLabel={formatOptionLabel}
        value={value}
        onChange={(option) => setFieldValue(field.name, option.value)}
        onBlur={handleBlur}
        menuPlacement={menuPlacement}
        className={`react-select-container ${error ? 'error' : ''}`}
        classNamePrefix="react-select"
        styles={customStyles}
      />
      {error && <span className="custom-input__error-msg">{error}</span>}
    </div>
  );
};
