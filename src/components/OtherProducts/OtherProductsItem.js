import React from 'react';
import { Link } from 'react-router-dom';
import { localizedPath } from '../../helpers/localizedPath';
import { Text } from '../Text/Text';
import { checkIfOutOfStock } from '../../helpers/productHelpers';
import { AddToCartButton } from '../common/Button/AddToCartButton';
import { ProductBadges } from '../Product/ProductBadges';
import { ProductImage } from '../ProductImage/ProductImage';

import './otherProductsItem.scss';
import { RiyalSymbol } from '../RiyalSymbol/RiyalSymbol';

export const OtherProductsItem = ({ item }) => (
  <div key={item.id} className="other-stuff-item">
    {item?.tags?.length > 0 && <ProductBadges badges={item.tags} />}
    <Link to={localizedPath(`/products/${item.slug || item.id}`)}>
      <ProductImage source={item.image_url} alt={item?.name} className="other-stuff-item__image" />
    </Link>
    <div className="other-stuff-item__content">
      <Text type="subtitle1" className="other-stuff-item__name">
        {item?.name}
      </Text>
      <Text type="body2" className="other-stuff-item__price text__rtl text__center">
        {item?.list_price}
        {' '}
        <RiyalSymbol size={10} />
      </Text>
      <AddToCartButton
        disabled={!item.is_purchasable || checkIfOutOfStock(item.tags)}
        productId={item?.id}
        hasAddons={item.addons}
        buttonType="plus"
        slug={item?.slug}
      />
    </div>
  </div>
);
