import React from 'react';
import './radioButton.scss';
/* eslint-disable react/jsx-props-no-spreading */

export const RadioButtonInput = ({
  text, name, id, value, currentValue, onChange, disabled, style, error, ...rest
}) => (
  <fieldset style={style}>
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={value === currentValue}
      onChange={onChange}
      className="btn-radio__input"
      disabled={disabled}
      {...rest}
    />
    <label
      className={`btn btn-radio ${currentValue === value ? 'selected' : ''} ${error ? 'error' : ''}`}
      htmlFor={id}
    >
      <span className="btn-radio__text">{text}</span>
    </label>
  </fieldset>
);
