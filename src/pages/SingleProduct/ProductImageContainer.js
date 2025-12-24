/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { ProductImage } from '../../components/ProductImage/ProductImage';
import { Tooltip } from '../../components/Tooltip/Tooltip';
import {
  useGetWishlistProductsQuery,
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
} from '../../services/user';
import WishlistIcon from '../../assets/icons/wishlist-icon.svg';
import WishlistIconFilled from '../../assets/icons/wishlist-icon-filled.svg';
import { Text } from '../../components/Text/Text';
import { ProductBadges } from '../../components/Product/ProductBadges';
import { useAuth } from '../../hooks/useAuth';

/* eslint-disable import/no-unresolved */
import 'swiper/css/pagination';
import { localizedPath } from '../../helpers/localizedPath';

export const ProductImageContainer = ({ product, images }) => {
  const user = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('application');
  const { data: wishlistProducts = [] } = useGetWishlistProductsQuery(!user && skipToken);
  const [addToWishlist, { isSuccess: isAddSuccessful }] = useAddProductToWishlistMutation();
  const [removeFromWishlist, { isSuccess: isRemoveSuccessful }] = useRemoveProductFromWishlistMutation();
  const [onWishlist, setOnWishlist] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const notify = (message, type) => {
    toast(<Text type="subtitle2">{message}</Text>, {
      type,
    });
  };

  useEffect(() => {
    if (wishlistProducts.length === 0 || !user) setOnWishlist(false);
    setOnWishlist(wishlistProducts.findIndex((el) => el.id === parseInt(product.id, 10)) >= 0);
  }, [wishlistProducts]);

  const handleAddToWishlist = async () => {
    if (!user) return;
    try {
      await addToWishlist(product.id);
    } catch (e) {
      console.error(e);
      notify(t('notifications.error'), 'error');
    }
  };

  const handleRemoveFromWishlist = async () => {
    if (!user) return;
    try {
      await removeFromWishlist(product.id);
    } catch (e) {
      console.error(e);
      notify(t('notifications.error'), 'error');
    }
  };

  useEffect(() => {
    if (isAddSuccessful) {
      notify(t('notifications.wishlist.add'), 'success');
    }
  }, [isAddSuccessful]);

  useEffect(() => {
    if (isRemoveSuccessful) {
      notify(t('notifications.wishlist.remove'), 'info');
    }
  }, [isRemoveSuccessful]);

  useEffect(() => {
    if (images.length > 1) {
      [prevRef, nextRef].forEach((ref) => {
        ref.current.classList.remove('swiper-button-lock');
        ref.current.classList.remove('swiper-button-disabled');
        ref.current.removeAttribute('disabled');
      });
    }
  }, [images.length]);

  const handleWishListClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warning(t('products.product.disabledWishlist'));
      navigate(localizedPath('/login'));
    }
  };

  return (
    <div className="product-single">
      <ProductBadges badges={product.tags} />
      <div className="product-single__img-wrapper">
        <button type="button" ref={prevRef} className="swiper-button-prev" aria-label={t('carousel.previous')} />
        <button type="button" ref={nextRef} className="swiper-button-next" aria-label={t('carousel.next')} />
        <Swiper
          slidesPerView={1}
          loop={false}
          navigation={{
            nextEl: nextRef.current,
            prevEl: prevRef.current,
          }}
          pagination={{ el: paginationRef.current, clickable: true }}
          modules={[Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <ProductImage source={image} className="product-single__img" alt="product" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="product-single__bottom">
        <div className="swiper-pagination" ref={paginationRef} />
        <Tooltip text={user ? '' : t('products.product.disabledWishlist')}>
          <div className="wishlist-div">
            <Button
              icon={onWishlist ? <WishlistIconFilled /> : <WishlistIcon />}
              disabled={!user}
              onClick={(event) => (
                onWishlist ? handleRemoveFromWishlist(event) : handleAddToWishlist(event)
              )}
            />

            {!user && (
            <div className="overlay" onClick={(e) => { handleWishListClick(e); }} />
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
