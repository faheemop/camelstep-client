import React from 'react';
import { TextFirstLetterCapitalized } from '../../Text/TextFirstLetterCapitalized';

import './customCheckbox.scss';

/* eslint-disable react/jsx-props-no-spreading */
export const CustomCheckbox = ({
  name, id, label, checked, value, onChange, index, error, ...rest
}) => (
  <div className="custom-checkbox custom-input-wrapper">
    <label className="custom-checkbox__label" htmlFor={id}>
      <input
        className={`custom-checkbox__input ${error && 'error'}`}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e, index)}
        name={name}
        value={value}
        {...rest}
      />
      <span style={{ marginInlineEnd: label ? '0.8rem' : 0 }} className="custom-checkbox__checkmark" />
      {label && (
        <span className="custom-checkbox__text">
          <TextFirstLetterCapitalized>{label}</TextFirstLetterCapitalized>
        </span>
      )}
    </label>
    {error && <span className="custom-input__error-msg">{error}</span>}
  </div>
);
