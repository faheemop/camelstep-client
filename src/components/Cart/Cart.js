import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { toggleCartModal } from "../../features/cart/cartSlice";
import { Text } from "../Text/Text";
import CloseIcon from "../../assets/icons/x.svg";
import { RecommendedProductsList } from "./RecommendedProductsList/RecommendedProductsList";
import {
  useGetCartPackagesQuery,
  useGetCartProductsQuery,
  useUpdateCartStateMutation,
} from "../../services/cart";
import { CartItemsList } from "./CartItemsList/CartItemsList";
import { Button } from "../common/Button/Button";
import { OrderTotalPrice } from "../Order/OrderTotalPrice";
import { useAuth } from "../../hooks/useAuth";

import "./cart.scss";
import { RiyalSymbol } from "../RiyalSymbol/RiyalSymbol";
import { localizedPath } from "../../helpers/localizedPath";

export const Cart = () => {
  const { t } = useTranslation("application");
  const isOpen = useSelector((state) => state.cart.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAuth();
  const { data } = useGetCartProductsQuery();
  const { data: packageItems } = useGetCartPackagesQuery();
  const [updateCartState, { isLoading }] = useUpdateCartStateMutation();

  const handleGoToCheckout = async () => {
    if (!user) {
      navigate(localizedPath("/login"), {
        state: { prevPath: localizedPath("/checkout") },
      });
      dispatch(toggleCartModal());
    } else {
      try {
        await updateCartState().unwrap();
        navigate(localizedPath("/checkout"));
      } catch (error) {
        toast.error(t("Cart Update Error"));
        console.error("Error updating cart state:", error);
      }
    }
  };

  return (
    <div className={`cart ${isOpen && "open"}`}>
      <CloseIcon
        className="cart__close"
        onClick={() => dispatch(toggleCartModal())}
      />
      <div className="cart__inner">
        <nav>
          <div>
            <div>
              <Text type="headline2">
                <a href="/" className="cart__link">
                  {t("common.yourCart")}
                </a>
              </Text>
              <div className="cart__divider" />
              <div className="cart__promos"></div>
              <CartItemsList
                cartItems={data?.records}
                packageItems={packageItems?.records}
                previousCartItems={data?.previous_cart_products || []}
              />
              <div className="cart__border" />
              {data?.recommended_products.length > 0 && (
                <RecommendedProductsList data={data?.recommended_products} />
              )}
            </div>
          </div>
        </nav>
        <div className="cart__bottom">
          <OrderTotalPrice
            variant="primary"
            totalLabel={`${t("cart.total")}`}
            totalPrice={
              <div className="text__rtl">
                {`${(
                  parseFloat(data?.total_price) +
                  parseFloat(data?.total_vat_price)
                ).toFixed(2)}`}{" "}
                <RiyalSymbol size={12} />
              </div>
            }
          />
          <Button
            className="cart__checkout"
            type="primary"
            disabled={
              (!data?.records?.length > 0 &&
                !packageItems?.records?.length > 0) ||
              isLoading
            }
            text={t("cart.goToCheckout")}
            onClick={handleGoToCheckout}
          />
        </div>
      </div>
    </div>
  );
};
