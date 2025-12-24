import React from 'react';
import { OrderProduct } from '../OrderProduct';

export const PackageProductsList = ({ products }) => (
  <ul className="products-list">
    {products.map((product, index) => (
      <li key={`${product.id} ${index}}}`}>
        <OrderProduct product={product} />
      </li>
    ))}
  </ul>
);
