import React from 'react';
import classNames from 'classnames';

import './container.scss';

export const Container = ({ children, fluid, className: customClasses }) => {
  const containerClasses = classNames({
    container: true,
    'container--fluid': fluid,
    [`${customClasses}`]: customClasses,
  });

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};
