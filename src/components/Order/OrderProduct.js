import React from 'react';

import { ProductCountBadge } from '../ProductCountBadge/ProductCountBadge';
import { useProductImage } from '../ProductImage/useProductImage';
import { ProductImage } from '../ProductImage/ProductImage';

import './orderProduct.scss';

export const OrderProduct = ({ product }) => {
  const { productImage } = useProductImage(product.product_id, product.variants);

  return (
    <div className="order-product">
      {product.quantity && <ProductCountBadge count={product.quantity} />}
      <ProductImage source={productImage || product.image_url} alt="order-product" className="order-product__image" />
    </div>
  );
};
