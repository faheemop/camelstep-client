import React from 'react';

import './plusButton.scss';

export const PlusButton = ({ onClick, disabled }) => (
  <button type="button" className="plus-button" onClick={onClick} disabled={disabled} aria-label="plus-button">
    <span className="plus-button__cross">
      <span className="plus-button__line plus-button__line-1" />
      <span className="plus-button__line plus-button__line-2" />
    </span>
  </button>
);
