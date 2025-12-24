import React from 'react';

export const RiyalSymbol = ({ size = '40px', color = 'black', className }) => {
  const getColorFilter = (colour) => {
    switch (colour.toLowerCase()) {
      case 'red':
        return 'brightness(0) saturate(100%) invert(34%) sepia(97%) saturate(7500%) hue-rotate(358deg) brightness(91%) contrast(124%)';
      case 'blue':
        return 'brightness(0) saturate(100%) invert(18%) sepia(20%) saturate(6255%) hue-rotate(170deg) brightness(96%) contrast(94%)';
      case 'white':
        return 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)';
      default:
        return 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(308deg) brightness(99%) contrast(101%);';
    }
  };

  return (
    <img
      src="/riyalSign.png"
      alt="Riyal Sign"
      style={{
        width: size,
        height: size,
        filter: getColorFilter(color),
      }}
      className={className}
    />
  );
};
