import React from 'react';
import InputMask from 'react-input-mask';

import './Input.scss';

/* eslint-disable react/jsx-props-no-spreading */
export const MaskedInput = ({
  name, id, type = 'text', label, value, error, onChange, mask, maskPlaceholder, ...rest
}) => (
  <div className="custom-input-wrapper">
    <label className="custom-input" htmlFor={id || name}>
      <InputMask
        name={name}
        value={value}
        className={`custom-input__input ${error && 'error'}`}
        type={type}
        placeholder={' '}
        onChange={onChange}
        mask={mask}
        maskPlaceholder={maskPlaceholder}
        {...rest}
      />
      {label && <span className="custom-input__label-container"><span className="custom-input__label">{label}</span></span>}
    </label>
    {error && <span className="custom-input__error-msg">{error}</span>}
  </div>
);
