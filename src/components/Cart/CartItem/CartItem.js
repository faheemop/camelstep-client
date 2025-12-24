import React from "react";
import { Visible, Hidden } from "react-grid-system";
import { useSelector, useDispatch } from "react-redux";
import { CartItemActions } from "../CartItemActions";
import {
  useDeleteCartProductMutation,
  useUnlockCartMutation,
  useDeleteCartPackageMutation,
} from "../../../services/cart";
import { ProductBadges } from "../../Product/ProductBadges";
import { Button } from "../../common/Button/Button";
import { SvgIcon } from "../../common/SvgIcon/SvgIcon";
import { notify } from "../../../utils/notifications";
import { buildErrorMsg } from "../../../helpers/errorHelpers";
import {
  setCurrentStep,
  setDiscountCode,
  setPendingPayment,
} from "../../../features/checkout/checkoutSlice";
import { useProductImage } from "../../ProductImage/useProductImage";
import { ProductPreview } from "../../ProductPreview/ProductPreview";
import { RiyalSymbol } from "../../RiyalSymbol/RiyalSymbol";

import "./cartItem.scss";
import { Text } from "../../Text/Text";
import { useTranslation } from "react-i18next";
import { useAddToCart } from "../../common/Button/addtoCart";
import { Chip } from "../../common/Chip/Chip";

export const CartItem = ({
  item,
  maxTotal,
  previousItem = false,
  isPackage = false,
}) => {
  const { t } = useTranslation("application");

  const [handleProductDelete] = useDeleteCartProductMutation();
  const [handlePackageDelete] = useDeleteCartPackageMutation();
  const checkoutCurrentStep = useSelector(
    (state) => state.checkout.currentStep
  );
  const isCartLocked = useSelector((state) => state.cart.isLocked);
  const [unlockCart] = useUnlockCartMutation();
  const dispatch = useDispatch();
  const { productImage } = useProductImage(item.product_id, item.variants);

  const handleCartUnlock = async () => {
    dispatch(setCurrentStep(1));
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    await unlockCart();
  };

  const handleRemoveProductFromCart = async (itemId) => {
    if (isCartLocked) {
      await handleCartUnlock();
    }
    if (isPackage) {
      const { error: { data: { errors } = {} } = {} } =
        await handlePackageDelete({ id: itemId });

      if (errors) {
        notify(buildErrorMsg(errors), "warning");
      }
    } else {
      const { error: { data: { errors } = {} } = {} } =
        await handleProductDelete({ id: itemId });

      if (errors) {
        notify(buildErrorMsg(errors), "warning");
      }
    }

    if (checkoutCurrentStep === 2) {
      dispatch(setCurrentStep(1));
    }
  };

  const formatVariants = (productVariants) =>
    productVariants
      .map((variant) => `${variant.name}: ${variant.value}`)
      .join(", ");

  const formatModificators = (productmodificators) =>
    productmodificators.map((modificator) => `${modificator.name}`).join(", ");

  const handleAddToCart = useAddToCart({
    productId: item.id,
  });

  const isGiftProduct = !!item?.discount_rule_id;

  return (
    <div className="cart-item">
      {/* Small and medium screen layout */}
      <Visible xs sm md>
        <div className="cart-item__mobile">
          {/* Change: Added !isGiftProduct check here */}
          {!previousItem && !isGiftProduct && (
            <div className="cart-item__delete-btn-parent">
              <Button
                type="iconButton"
                icon={
                  <SvgIcon
                    id="icon-delete"
                    width={30}
                    height={30}
                    className="cart-item__delete-icon"
                  />
                }
                onClick={() => handleRemoveProductFromCart(item.id)}
                className="cart-item__delete-btn"
              />
            </div>
          )}

          <div className="cart-item__image-container">
            <ProductPreview
              productImage={productImage || item.image_url}
              productCount={item.quantity ? parseInt(item.quantity, 10) : 1}
            />
          </div>

          <div className="cart-item__product-info">
            <Text className="cart-item__name" type="headline2">
              <>
                {item.name}
                {isGiftProduct && !previousItem && (
                  <Chip label={t("cart.giftProduct")} />
                )}
              </>
            </Text>
            {item.variants && item.variants.length > 0 && (
              <Text type="subtitle2">{formatVariants(item.variants)}</Text>
            )}
            {item.modificators && item.modificators.length > 0 && (
              <Text type="subtitle2">
                {formatModificators(item.modificators)}
              </Text>
            )}
            <Text
              className={`cart-item__price ${
                isGiftProduct && !previousItem ? "cart-item__price--gift" : ""
              }`}
              type="body2"
            >
              {!previousItem
                ? (isGiftProduct
                    ? parseFloat(item.list_price) +
                      parseFloat(item.vat_price || 0)
                    : parseFloat(item.total_quantity_price) +
                      (item.vat_price
                        ? parseFloat(item.vat_price) * parseFloat(item.quantity)
                        : 0)
                  ).toFixed(2)
                : (
                    parseFloat(item.list_price) + parseFloat(item.vat_price)
                  ).toFixed(2)}{" "}
              <RiyalSymbol size={12} />
            </Text>
          </div>

          {!previousItem ? (
            !isGiftProduct && (
              <div className="cart-item__actions">
                <CartItemActions item={item} maxTotal={maxTotal} />
                <Text className="cart-item__discount-hint" type="caption">
                  {t("cart.vatIncluded")}
                </Text>
              </div>
            )
          ) : (
            <div className="cart-item__actions">
              <p
                className="cart-item__add-to-cart-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                {t("common.addToCart")}
              </p>
              <Text className="cart-item__discount-hint" type="caption">
                {t("cart.vatIncluded")}
              </Text>
            </div>
          )}
        </div>
      </Visible>

      {/* Large screen layout */}
      <Hidden xs sm md>
        <div className="cart-item__desktop">
          <div className="cart-item__image-container">
            <ProductPreview
              productImage={productImage || item.image_url}
              productCount={item.quantity ? parseInt(item.quantity, 10) : 1}
            />
          </div>

          <div className="cart-item__product-info cart-items__product-details">
            <Text className="cart-item__name" type="headline2">
              <>
                {item.name}
                {isGiftProduct && !previousItem && (
                  <Chip label={t("cart.giftProduct")} />
                )}
              </>
            </Text>
            {item.variants && item.variants.length > 0 && (
              <Text type="subtitle2">{formatVariants(item.variants)}</Text>
            )}
            {item.modificators && item.modificators.length > 0 && (
              <Text type="subtitle2">
                {formatModificators(item.modificators)}
              </Text>
            )}
            <div className="cart-item__price-vat">
              <Text
                className={`cart-item__price ${
                  isGiftProduct && !previousItem ? "cart-item__price--gift" : ""
                }`}
                type="body2"
              >
                {!previousItem
                  ? (isGiftProduct
                      ? parseFloat(item.list_price) +
                        parseFloat(item.vat_price || 0)
                      : parseFloat(item.total_quantity_price) +
                        (item.vat_price
                          ? parseFloat(item.vat_price) *
                            parseFloat(item.quantity)
                          : 0)
                    ).toFixed(2)
                  : (
                      parseFloat(item.list_price) + parseFloat(item.vat_price)
                    ).toFixed(2)}{" "}
                <RiyalSymbol size={12} />
              </Text>
              <div className="cart-item__product-vat">
                {t("cart.vatIncluded")}
              </div>
            </div>
          </div>

          {!previousItem ? (
            !isGiftProduct && (
              <div className="cart-item__actions-lg">
                <Button
                  type="iconButton"
                  icon={
                    <SvgIcon
                      id="icon-delete"
                      width={40}
                      height={40}
                      className=""
                    />
                  }
                  onClick={() => handleRemoveProductFromCart(item.id)}
                  className="cart-item__delete-btn"
                />
                <CartItemActions item={item} maxTotal={maxTotal} />
              </div>
            )
          ) : (
            <>
              <p
                className="cart-item__add-to-cart-btn "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                {t("common.addToCart")}
              </p>
            </>
          )}
        </div>
      </Hidden>
    </div>
  );
};
