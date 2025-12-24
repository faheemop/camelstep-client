import React from 'react';

import { ProductCountBadge } from '../ProductCountBadge/ProductCountBadge';
import { ProductImage } from '../ProductImage/ProductImage';

import './productPreview.scss';

export const ProductPreview = ({ productImage, productCount }) => (
  <div className="product-preview">
    <ProductImage source={productImage} className="product-preview__image" alt="order-product" />
    <ProductCountBadge count={productCount} />
  </div>
);
