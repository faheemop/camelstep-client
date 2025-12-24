import React from 'react';
import { Text } from '../Text/Text';

import './squareBox.scss';

export const SquareBox = ({ content }) => (
  <div className="square-box">
    <div className="square-box__inner"><Text type="btn-s">{content}</Text></div>
  </div>
);
