import React from 'react';

import './alert.scss';

export const Alert = ({
  type, children, className,
}) => (
  <div className={`alert alert--${type} ${className}`}>
    {children}
  </div>
);
