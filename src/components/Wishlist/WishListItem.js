import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '../common/Button/Button';
import { Text } from '../Text/Text';
import { Badge } from '../common/Badge/Badge';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { useRemoveProductFromWishlistMutation } from '../../services/user';
import { AddToCartButton } from '../common/Button/AddToCartButton';
import { ProductImage } from '../ProductImage/ProductImage';

import './wishlistItem.scss';
import { checkIfOutOfStock } from '../../helpers/productHelpers';
import { RiyalSymbol } from '../RiyalSymbol/RiyalSymbol';
import { localizedPath } from '../../helpers/localizedPath';

const ImageWrapper = ({
  isHidden, id, slug, children,
}) => (isHidden ? (<span>{children}</span>) : <Link to={localizedPath(`/products/${slug || id}`)}>{children}</Link>);

export const WishListItem = ({
  id, name, price, tags, image, hasAddons, isHidden, slug,
}) => {
  const { t } = useTranslation('application');

  const [removeProductFromWishlist] = useRemoveProductFromWishlistMutation();

  const handleRemoveProductFromWishlist = async () => {
    await removeProductFromWishlist(id);
  };

  const soldOut = checkIfOutOfStock(tags);

  if (soldOut) {
    return (
      <div className="wishlist-item wishlist-item--sold-out">
        <div className="wishlist-item__top">
          <div className="wishlist-item__badges">
            {tags.map((tag, index) => (
              <Badge key={index} type={tag.key} />
            ))}
          </div>
          <Button icon={<SvgIcon id="icon-delete" width={32} height={32} />} onClick={handleRemoveProductFromWishlist} />
        </div>
        <div className="wishlist-item__img-container">
          <ImageWrapper isHidden={isHidden} id={id} slug={slug}>
            <ProductImage source={image} alt="wishlist product" className="wishlist-item__img" />
            <Text className="wishlist-item__sold-out" type="headline3">
              {t('tags.soldOut')}
            </Text>
          </ImageWrapper>
        </div>
        <Text className="wishlist-item__name" style={{ marginBottom: '1rem' }} type="subtitle2">
          {name}
        </Text>
        <div className="price-tag-container">
          <Text className="wishlist-item__price text__rtl price-tag" style={{ marginBottom: '1.5rem' }} type="body2">
            {price}
            {' '}
            <RiyalSymbol size={10} className="opacity-30" />
          </Text>
        </div>
        <Text className="wishlist-item__unavailable-text" type="body2">
          {t('profile.notifications.wishList')}
        </Text>
      </div>
    );
  }

  return (
    <div className="wishlist-item">
      <div className="wishlist-item__top">
        <div className="wishlist-item__badges">
          {tags.map((tag, index) => (
            <Badge key={index} type={tag.key} />
          ))}
        </div>
        <Button icon={<SvgIcon id="icon-delete" width={32} height={32} />} onClick={handleRemoveProductFromWishlist} />
      </div>
      <ImageWrapper isHidden={isHidden} id={id}>
        <ProductImage source={image} alt="wishlist product" className="wishlist-item__img" />
      </ImageWrapper>
      <Text style={{ marginBottom: '1rem' }} type="subtitle2">
        {name}
      </Text>
      <div className="price-tag-container">
        <Text className="text__rtl" style={{ marginBottom: '1.5rem' }} type="body2">
          {price}
          {' '}
          <RiyalSymbol size={10} />
        </Text>
      </div>
      <AddToCartButton productId={id} slug={slug} hasAddons={hasAddons} disabled={isHidden || soldOut} />
    </div>
  );
};
