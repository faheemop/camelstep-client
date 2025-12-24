import React, { useEffect } from 'react';
import { useGetProductModificatorsQuery } from '../../services/products';
import { ProductModificators } from './ProductModificators';

export const ModificatorsContainer = ({ product, activeModificators, setActiveModificators }) => {
  const { data: productModificatorsData = [] } = useGetProductModificatorsQuery(product.id);

  const handleModificatorsChange = (e, position) => {
    const { checked } = e.target;
    const updatedModificators = activeModificators.map((item, index) => {
      if (index === position) {
        return {
          ...item,
          checked,
        };
      }
      return item;
    });
    setActiveModificators(updatedModificators);
  };

  useEffect(() => {
    if (productModificatorsData.length > 0) {
      const modificators = productModificatorsData.map((modificator) => ({
        checked: false,
        price: modificator.price,
        modificatorId: modificator.id,
      }));
      setActiveModificators(modificators);
    } else {
      setActiveModificators([]);
    }
  }, [productModificatorsData]);

  return (
    activeModificators.length > 0 && (
      <ProductModificators
        modificatorData={productModificatorsData}
        modificatorValues={activeModificators}
        setModificatorValues={handleModificatorsChange}
      />
    )
  );
};
