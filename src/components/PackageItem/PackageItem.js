/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { localizedPath } from "../../helpers/localizedPath";

import { Button } from "../common/Button/Button";
import { Text } from "../Text/Text";
import WishlistIcon from "../../assets/icons/wishlist-icon.svg";
import WishlistIconFilled from "../../assets/icons/wishlist-icon-filled.svg";
import {
  useAddProductToWishlistMutation,
  useGetWishlistProductsQuery,
  useRemoveProductFromWishlistMutation,
} from "../../services/user";
import { useAuth } from "../../hooks/useAuth";
import { AddToCartButton } from "../common/Button/AddToCartButton";
import { Tooltip } from "../Tooltip/Tooltip";
import { ProductImage } from "../ProductImage/ProductImage";

import "../ProductItem/productItem.scss";
import { RiyalSymbol } from "../RiyalSymbol/RiyalSymbol";
import { useAddToCart } from "../common/Button/addtoCart";

export const PackageItem = ({
  // product: { id, list_price, cover_image_url, name_en, name_ar },
  product: {
    id,
    slug,
    name_en,
    name_ar,
    list_price,
    vat_price,
    addons,
    cover_image_url,
  },
}) => {
  const { t, i18n } = useTranslation("application");
  const navigate = useNavigate();
  const [addToWishlist, { isSuccess: isAddSuccessful }] =
    useAddProductToWishlistMutation();
  const [removeFromWishlist, { isSuccess: isRemoveSuccessful }] =
    useRemoveProductFromWishlistMutation();
  const user = useAuth();
  const { data: wishlistProducts = [] } = useGetWishlistProductsQuery(
    !user && skipToken
  );
  const [onWishlist, setOnWishlist] = useState(false);
  const package_name = i18n.language === "ar" ? name_ar : name_en;
  const is_purchasable = true;

  const notify = (message, type) => {
    toast(<Text type="subtitle2">{message}</Text>, { type });
  };

  // eslint-disable-next-line consistent-return
  const handleAddToWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) return false;
    try {
      await addToWishlist(id);
    } catch (e) {
      console.error(e);
      notify(t("notifications.error"), "error");
    }
  };

  const handleRemoveFromWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) return false;
    try {
      await removeFromWishlist(id);
    } catch (e) {
      console.error(e);
      notify(t("notifications.error"), "error");
    }
  };
  const handleAddToCart = useAddToCart({
    productId: id,
    hasAddons: addons,
    slug: slug,
    isPackage: true,
  });

  useEffect(() => {
    if (wishlistProducts.length === 0 || !user) setOnWishlist(false);
    setOnWishlist(wishlistProducts.findIndex((el) => el.id === +id) >= 0);
  }, [wishlistProducts]);

  useEffect(() => {
    if (isAddSuccessful) {
      notify(t("notifications.wishlist.add"), "success");
    }
  }, [isAddSuccessful]);

  useEffect(() => {
    if (isRemoveSuccessful) {
      notify(t("notifications.wishlist.remove"), "info");
    }
  }, [isRemoveSuccessful]);

  const handleWishListClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warning(t("products.product.disabledWishlist"));
      navigate(localizedPath("/login"));
    }
  };

  return (
    <motion.div
      key={id}
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="product"
    >
      <div className="product-inner">
        <Link to={localizedPath(`/packages/${id}`)} className="product__board">
          {/* Image */}
          <div className="product__image-container">
            <ProductImage
              source={cover_image_url}
              className="product__image"
              alt={package_name}
            />
          </div>

          {/* Details */}
          <div className="product__details">
            {/* Wishlist */}
            <div className="product__socials">
              <Tooltip
                text={user ? "" : t("products.product.disabledWishlist")}
              >
                <div className="wishlist-div">
                  <Button
                    icon={
                      onWishlist ? <WishlistIconFilled /> : <WishlistIcon />
                    }
                    disabled={!user}
                    onClick={(event) =>
                      onWishlist
                        ? handleRemoveFromWishlist(event)
                        : handleAddToWishlist(event)
                    }
                  />
                  {!user && (
                    <div
                      className="overlay"
                      onClick={(e) => {
                        handleWishListClick(e);
                      }}
                    />
                  )}
                </div>
              </Tooltip>
            </div>

            {/* Name, Price, Add to Cart */}
            <div className="product__info">
              <h1 className="product__name">{package_name}</h1>
              <div className="price-container">
                <div className="product__price text__rtl">
                  {(
                    parseFloat(list_price) + parseFloat(vat_price)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <RiyalSymbol size={14} className="riyal__symbol" />
                </div>
                <p
                  className="add-to-cart-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  {t("common.addToCart")}
                </p>
              </div>
            </div>

            {/* Big button for mobile */}
            <div className="big-add-to-cart">
              <AddToCartButton
                disabled={!is_purchasable}
                buttonType="standard"
                productId={id}
                isPackage={true}
              />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
