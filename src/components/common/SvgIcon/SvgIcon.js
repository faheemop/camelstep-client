import React from 'react';

import './svgIcon.scss';

export const SvgIcon = ({
  id, className, width, height, onClick, style,
}) => (
  <svg className={`svg-icon ${className || ''}`} width={width} height={height} onClick={onClick} style={style}>
    <use className={`use-${className}`} href={`#${id}`} x="0" y="0" />
  </svg>
);
