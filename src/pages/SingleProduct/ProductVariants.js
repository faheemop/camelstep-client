import React, { useEffect, useState } from 'react';
import { Text } from '../../components/Text/Text';
import { ProductImage } from '../../components/ProductImage/ProductImage';

const mapDataToOptionValues = (data) => data.map((item) => ({
  id: item.id,
  name: item.name,
  variant_image_url: item.variant_image_url,
  variant_product_id: item.variant_product_id,
  value: [
    {
      id: 0,
      name: 'none',
      value: 'none',
    },
    ...item.values.map((value) => ({
      id: value.id,
      name: value.name,
      value: value.id,
    })),
  ],
}));

export const ProductVariants = ({ setVariantValue, variantsData, variantValue }) => {
  const [variantOptions, setVariantOptions] = useState([]);

  useEffect(() => {
    if (variantsData && variantsData.length > 0) {
      const options = mapDataToOptionValues(variantsData);
      setVariantOptions(options);
    } else {
      setVariantOptions([]);
    }
  }, [variantsData]);

  const variantSelectHandler = (selectedValue, variantId) => {
    setVariantValue((prevState) => {
      const isCurrentlySelected = prevState.some((item) => item.variantId === variantId && item.variantValueId === selectedValue);
      let newVariantValue;
      if (isCurrentlySelected) {
        newVariantValue = prevState.map((item) => {
          if (item.variantId === variantId) {
            return { ...item, variantValueId: 'none' };
          }
          return item;
        });
      } else {
        newVariantValue = prevState.map((item) => {
          if (item.variantId === variantId) {
            return { ...item, variantValueId: selectedValue };
          }
          return item;
        });
      }
      return newVariantValue;
    });
  };

  const productVariant = (option, variantId) => (
    <div
      className="variant-each-product"
      role="button"
      tabIndex={0}
      onClick={() => variantSelectHandler(option.value, variantId, option.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          variantSelectHandler(option.value, variantId, option.id);
        }
      }}
    >
      <div className={`${option.value === variantValue.find((item) => item.variantId === variantId)?.variantValueId && 'variant-selected'}`}>
        <ProductImage
          source={option.variant_image_url}
          className="other-image"
          alt="product"
        />
      </div>
      <div>{option.name}</div>
    </div>
  );

  return (
    variantOptions.length > 0 && (
      <div className="product-variants" style={{ margin: '2rem 0' }}>
        {variantOptions.map((variant) => (
          <div className="product-variants__variant" key={variant.id} style={{ marginBottom: '2rem' }}>
            <Text className="variant-name-tag" type="subtitle1">{variant.name}</Text>
            <div className="variant-product-section">
              {variant.value && variant.value.length > 0 && (
                <div className="variant-product-container">
                  {variant.value
                    .filter((option) => option.value !== 'none')
                    .map((option) => productVariant(option, variant.id))}
                </div>
              )}
            </div>
          </div>
        ))}
        <hr />
      </div>
    )
  );
};
