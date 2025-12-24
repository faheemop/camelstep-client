import { useState, useEffect } from 'react';
import { useLazyGetProductVariantQuery } from '../../services/products';

export const useProductImage = (productId, variants) => {
  const [productImage, setProductImage] = useState(null);
  const [getProductVariant] = useLazyGetProductVariantQuery();

  useEffect(() => {
    if (variants?.length > 0) {
      const selectedVariantsIds = variants
        .filter((variant) => variant.variantValueId !== 'none')
        .map((variant) => variant.variantValueId);

      getProductVariant({
        id: productId,
        variantValuesIds: selectedVariantsIds,
      }).then((result) => {
        const { data: resultData } = result;
        if (resultData) {
          setProductImage(resultData.main_image_url);
        }
      });
    }
  }, []);

  return { productImage };
};
