import React, { useState } from "react";
import ProductPlaceholderImg from "../../assets/icons/product-placeholder.svg";

export const ProductImage = ({ source, alt, className, style }) => {
  const [error, setError] = useState(null);
  const { API_ROOT } = process.env;

  // Pass the 'style' prop to the placeholder
  if (!source || error) {
    return (
      <ProductPlaceholderImg
        className={`product-image ${className ?? ""}`}
        style={style}
      />
    );
  }

  // Pass the 'style' prop to the actual image
  return (
    <img
      src={`${API_ROOT}${source}`}
      onError={() => setError(true)}
      alt={alt}
      className={`product-image ${className ?? ""}`}
      style={style}
    />
  );
};
