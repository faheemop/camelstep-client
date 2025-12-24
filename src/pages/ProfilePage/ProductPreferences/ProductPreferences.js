import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PreferenceContainer } from '../../../components/ProductPreferences/PreferenceContainer';
import { Text } from '../../../components/Text/Text';
import { useGetProductPreferencesQuery } from '../../../services/user';

export const ProductPreferences = () => {
  const { t } = useTranslation('application');

  useGetProductPreferencesQuery();
  const userProductPreferences = useSelector((state) => state.user.productPreferences);

  return (
    <div>
      <Text type="headline3" style={{ marginBottom: '2rem' }}>
        {t('profile.nav.preferences')}
      </Text>
      <Text type="body2">{t('profile.preferences.info')}</Text>
      <PreferenceContainer
        preferenceCategory="Coffee"
        preferencesData={userProductPreferences.coffee}
      />
      <PreferenceContainer
        preferenceCategory="Tools"
        preferencesData={userProductPreferences.tools}
      />
    </div>
  );
};
