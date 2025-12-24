/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { localizedPath } from "../../helpers/localizedPath";

import { Badge } from "../common/Badge/Badge";
import { Button } from "../common/Button/Button";
import { Text } from "../Text/Text";
import WishlistIcon from "../../assets/icons/wishlist-icon.svg";
import WishlistIconFilled from "../../assets/icons/wishlist-icon-filled.svg";
import BeanIcon from "../../assets/icons/beans-icon.svg";
import { capitalizeFirstLetter } from "../../helpers/textHelpers";
import {
  useAddProductToWishlistMutation,
  useGetWishlistProductsQuery,
  useRemoveProductFromWishlistMutation,
} from "../../services/user";
import { useAuth } from "../../hooks/useAuth";
import { checkIfOutOfStock } from "../../helpers/productHelpers";
import { AddToCartButton } from "../common/Button/AddToCartButton";
import { Tooltip } from "../Tooltip/Tooltip";
import { ProductImage } from "../ProductImage/ProductImage";
import { RiyalSymbol } from "../RiyalSymbol/RiyalSymbol";

import "./productItem.scss";
import { useAddToCart } from "../common/Button/addtoCart";
import { useDispatch } from "react-redux";
import { resetFilters } from "../../features/products/productsSlice";

export const ProductItem = ({
  product: {
    id,
    slug,
    name,
    tags,
    list_price,
    vat_price,
    addons,
    image_url,
    grouping,
    is_purchasable,
    short_description,
    short_description_ar,
  },
}) => {
  const { t, i18n } = useTranslation("application");
  const dispatch = useDispatch();
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
  const handleAddToCart = useAddToCart({
    productId: id,
    hasAddons: addons,
    slug: slug,
    isPackage: false,
  });

  const notify = (message, type) => {
    toast(<Text type="subtitle2">{message}</Text>, {
      type,
    });
  };

  // eslint-disable-next-line consistent-return
  const handleAddToWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      return false;
    }
    try {
      await addToWishlist(id);
    } catch (e) {
      console.error(e);
      notify(t("notifications.error"), "error");
    }
  };

  // eslint-disable-next-line consistent-return
  const handleRemoveFromWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      return false;
    }
    try {
      await removeFromWishlist(id);
    } catch (e) {
      console.error(e);
      notify(t("notifications.error"), "error");
    }
  };

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

  const resetFilterStates = () => {
    dispatch(resetFilters());
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
        <div
          // to={localizedPath(`/products/${slug || id}`)}
          className="product__board"
          onClick={() => {
            // then navigate
            navigate(localizedPath(`/products/${slug || id}`));
            // clear state first
            resetFilterStates();
          }}
        >
          <div className="product__image-container">
            <ProductImage
              source={image_url}
              className="product__image"
              alt={name}
            />
          </div>
          {/* <div className="product__badges">
            {tags?.map((tag) => (
              <Badge key={tag.key} type={tag.key} />
            ))}
          </div> */}
          <div className="product__details">
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
            <div className="product__info">
              <h1 className="product__name">{name}</h1>
              {/* <h1 className="product__dummy">
                {short_description ? short_description : "\u00A0"}
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </h1> */}
              <h1 className="product__dummy">
                {i18n.language === "ar"
                  ? short_description_ar || "\u00A0"
                  : short_description || "\u00A0"}
              </h1>
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
                {/* <p className="add-to-cart-button">{t("common.addToCart")}</p> */}
                <p
                  className={`add-to-cart-button ${
                    checkIfOutOfStock(tags) || !is_purchasable ? "disabled" : ""
                  }`}
                  onClick={(e) => {
                    if (checkIfOutOfStock(tags) || !is_purchasable) return; // prevent click
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  {checkIfOutOfStock(tags) || !is_purchasable
                    ? t("products.product.outOfStock")
                    : t("common.addToCart")}
                </p>
              </div>
            </div>
            {grouping === "coffee" && (
              <p className="product__description">
                <span>
                  <BeanIcon />
                </span>
                {capitalizeFirstLetter(t("products.product.beansInfo"))}
              </p>
            )}
            <div className="big-add-to-cart">
              <AddToCartButton
                disabled={checkIfOutOfStock(tags) || !is_purchasable}
                buttonType="standard"
                productId={id}
                slug={slug}
                hasAddons={addons}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
