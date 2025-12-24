import React from 'react';

import './productCountBadge.scss';

export const ProductCountBadge = ({ count }) => (
  <div className="product-count-badge">
    {+count >= 100 ? '99+' : +count}
  </div>
);
