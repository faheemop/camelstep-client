import React from 'react';

import './RateBox.scss';

export const RateBox = ({
  groupId, text, icon, selected, onSelect,
}) => (
  <div className="rate-box">
    <input
      type="radio"
      name={groupId}
      value={text}
      id={`${groupId}-${text}`}
      checked={selected(text)}
      onChange={() => onSelect(text)}
      className="rate-box__input"
    />
    <label htmlFor={`${groupId}-${text}`} className="rate-box__label">
      {icon}
      {text}
      <span className="rate-box__checkmark" />
    </label>
  </div>
);
