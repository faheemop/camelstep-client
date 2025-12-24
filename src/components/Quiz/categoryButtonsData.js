import React from 'react';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';

export const categoryButtons = [
  {
    type: 'radio',
    name: 'category',
    id: 'coffee',
    icon: <SvgIcon id="coffee-cup" className="coffee-cup-icon" width="20" height="20" />,
  },
  {
    type: 'radio',
    name: 'category',
    id: 'tool',
    icon: <SvgIcon id="tool-icon" className="tool-icon" width="20" height="20" />,
  },
];
