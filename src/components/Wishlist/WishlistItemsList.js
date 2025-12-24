import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetWishlistProductsQuery } from '../../services/user';
import { Text } from '../Text/Text';
import { WishListItem } from './WishListItem';

import './wishlistItemsList.scss';

export const WishlistItemsList = () => {
  const { t } = useTranslation('application', { keyPrefix: 'profile' });
  const { data = [] } = useGetWishlistProductsQuery();

  return data.length > 0 ? (
    <div className="wishlist-items-list">
      {data.map((wishListItem, index) => (
        <WishListItem
          key={index}
          name={wishListItem.name}
          id={wishListItem.id}
          image={wishListItem.image_url}
          price={wishListItem.list_price}
          tags={wishListItem.tags}
          hasAddons={wishListItem.addons}
          isHidden={!wishListItem.visible}
        />
      ))}
    </div>
  ) : (
    <Text type="headline3">{t('wishList.wishlistEmpty')}</Text>
  );
};
