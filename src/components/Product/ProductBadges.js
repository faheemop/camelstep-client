import React from 'react';
import { Badge } from '../common/Badge/Badge';

import './productBadges.scss';

export const ProductBadges = ({ badges }) => {
  if (!badges) return null;
  return (
    <div className="product-badges">
      {badges.map((badge) => (
        <Badge key={badge.key} type={badge.key} />
      ))}
    </div>
  );
};
