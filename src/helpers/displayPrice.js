import React from 'react';
import { RiyalSymbol } from '../components/RiyalSymbol/RiyalSymbol';

export const displayPrice = (price) => {
  if (!price) return '';
  if (typeof price !== 'number') {
    return (
      <span className="text__rtl">
        {`${price} `}
        <RiyalSymbol size={10} />
      </span>
    );
  }
  return (
    <span className="text__rtl">
      {`${price?.toFixed(2)} `}
      <RiyalSymbol size={10} />
    </span>
  );
};
