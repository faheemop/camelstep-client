import classNames from 'classnames';
import React from 'react';

import './button.scss';

export const Button = ({
  text, type, children, inverted, onClick, style, className, buttonType = 'button', icon, disabled, ...props
}) => {
  const buttonClasses = () => {
    const classes = classNames({
      btn: true,
      'btn--authPrimary': type === 'authPrimary',
      'btn--primary': type === 'primary',
      'btn--secondary': type === 'secondary',
      'btn--tertiary': type === 'tertiary',
      'btn--neumorphism': type === 'neumorphism',
      'btn--naked': type === 'naked',
      'btn--iconButton': icon,
      'btn--inactive': disabled,
      inverted,
    });

    return `${classes} ${className || ''}`;
  };

  /* eslint-disable react/button-has-type */
  return icon ? (
    <button type={buttonType} className={buttonClasses()} style={style} onClick={onClick} disabled={disabled}>
      {icon}
      {children}
    </button>
  ) : (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <button type={buttonType} className={buttonClasses()} onClick={onClick} style={style} disabled={disabled} {...props}>
      {children && <span>{children}</span>}
      {text}
    </button>
  );
};
