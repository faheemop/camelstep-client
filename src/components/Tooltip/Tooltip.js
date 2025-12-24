import React from 'react';

import './tooltip.scss';

export const Tooltip = ({ text = '', children }) => (
  <div data-tooltip-active={text.length > 0} title={text} className="custom-tooltip">
    {children}
  </div>
);
