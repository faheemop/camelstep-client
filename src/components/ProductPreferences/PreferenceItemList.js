import React from 'react';
import { PreferenceItem } from './PreferenceItem';

import './preferenceItemList.scss';

export const PreferenceItemList = ({ preferencesData }) => (
  <div className="preference-item-list">
    {Object.entries(preferencesData).map(([key, val], index) => (
      <PreferenceItem key={index} preference={{ name: key, value: val }} />
    ))}
  </div>
);
