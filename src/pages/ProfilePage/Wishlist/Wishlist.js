import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/Text/Text';
import { WishlistItemsList } from '../../../components/Wishlist/WishlistItemsList';

import './wishlist.scss';

export const Wishlist = () => {
  const { t } = useTranslation('application');

  return (
    <div className="profile-subpage profile-wishlist">
      <div className="wishlist-header">
        <Text style={{ marginBottom: '2rem' }} type="headline3">{t('profile.nav.wishlist')}</Text>
      </div>
      <WishlistItemsList />
    </div>
  );
};
