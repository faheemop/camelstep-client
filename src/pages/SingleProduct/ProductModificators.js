import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomCheckbox } from '../../components/inputs/CustomCheckbox/CustomCheckbox';
import { Text } from '../../components/Text/Text';

const mapDataToOptionValues = (data) => data.map((item) => ({
  id: item.id,
  name: item.name,
  price: item.price,
}));

export const ProductModificators = ({ modificatorData, modificatorValues, setModificatorValues }) => {
  const { t } = useTranslation('application', { keyPrefix: 'products.product' });
  const [modificatorOptions, setModificatorOptions] = useState([]);

  useEffect(() => {
    if (modificatorData.length > 0) {
      const options = mapDataToOptionValues(modificatorData);
      setModificatorOptions(options);
    } else {
      setModificatorOptions([]);
    }
  }, [modificatorData]);

  return (
    modificatorOptions.length > 0 && (
      <div className="product-modificators">
        <Text style={{ marginBottom: '1rem' }} type="subtitle1">
          {t('modificators')}
        </Text>
        {modificatorOptions.map((modificator, index) => (
          <div className="product-modificators__modificator" key={modificator.id} style={{ marginBottom: '2rem' }}>
            <CustomCheckbox
              checked={modificatorValues[0][0]}
              label={(
                <>
                  <Text type="body2" style={{ fontWeight: '700' }}>
                    {modificator.name}
                  </Text>
                  {' '}
                  <Text type="body2">{`(+${modificator.price})`}</Text>
                </>
              )}
              name="sortBy"
              value={modificatorValues[index - 1]}
              onChange={setModificatorValues}
              index={index}
            />
          </div>
        ))}
        <hr style={{ margin: '2rem 0' }} />
      </div>
    )
  );
};
