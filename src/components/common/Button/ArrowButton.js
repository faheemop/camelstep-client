import React from 'react';

import Arrow from '../../../assets/icons/arrow.svg';

import './arrowButton.scss';

export const ArrowButton = ({ direction, onClick }) => (
  <button type="button" className={`arrow-btn ${direction === 'up' ? 'up' : 'down'}`} onClick={onClick}>
    <Arrow />
  </button>
);
