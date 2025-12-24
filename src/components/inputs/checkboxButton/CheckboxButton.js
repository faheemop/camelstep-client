import React from 'react';

import './checkboxButton.scss';

/* eslint-disable react/jsx-props-no-spreading */
export const CheckboxButton = ({
  text, type = 'checkbox', icon, name, id, value, currentValue, onChange, disabled, checked, readonly, style, error, ...rest
}) => (
  <fieldset style={style}>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      checked={value && currentValue ? value === currentValue : checked}
      onChange={onChange}
      className="btn-checkbox__input"
      disabled={disabled}
      readOnly={readonly}
      {...rest}
    />
    <label className={`${currentValue === value ? 'checked' : ''} ${error && 'error'} btn btn-checkbox`} htmlFor={id}>
      {icon && icon}
      <span className="btn-checkbox__text">{text}</span>
      <span className="checkmark" />
    </label>
  </fieldset>
);
