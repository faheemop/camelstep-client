import React from 'react';

import { useSelector } from 'react-redux';
import HeartIcon from '../../assets/icons/heart-icon.svg';
import { Button } from '../common/Button/Button';
import { ProductCountBadge } from '../ProductCountBadge/ProductCountBadge';

export const CountWishListIcon = ({ onClick, className }) => {
  const totalWishListData = useSelector((state) => state.user.wishListData);

  const totalCount = totalWishListData?.length;

  return (
    <Button className="btn-wishlist" icon={<HeartIcon className={className} />} onClick={onClick}>
      {totalCount > 0 && (<ProductCountBadge count={totalCount} />)}
    </Button>
  );
};
