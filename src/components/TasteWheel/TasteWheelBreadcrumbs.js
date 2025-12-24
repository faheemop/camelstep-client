import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isBlank, transformName } from '../../helpers/textHelpers';
import { Text } from '../Text/Text';

export const TasteWheelBreadcrumbs = ({ data, isStatic = false }) => {
  const { t } = useTranslation('application');

  const [breadcrumbs, setBreadcrumbs] = React.useState([]);

  useEffect(() => {
    const newBreadcrumbs = Object.keys(data).reduce((acc, key) => {
      if (!isBlank(data[key].name) && data[key].name !== 'none') acc.push(data[key].name);
      return acc;
    }, []);
    setBreadcrumbs(newBreadcrumbs);
  }, [data]);

  return (
    <div className={`tastewheel__selection ${isStatic && 'static'}`}>
      <Text type="body2" style={{ marginInlineEnd: 10, color: '#8C8C8C', display: 'block' }}>
        {t('tasteWheel.selectNote')}
      </Text>
      <Text type="body2" style={{ marginInlineEnd: 10 }}>
        {breadcrumbs.length > 0
          && breadcrumbs.map((el, i) => (
            <span key={i}>
              {' '}
              <span>{i > 0 && !isBlank(el) && '>'}</span>
              {' '}
              <span style={{ color: i + 1 === breadcrumbs.length ? '#00546F' : 'inherit' }}>{t(`tastes.${transformName(el)}`)}</span>
            </span>
          ))}
      </Text>
    </div>
  );
};
