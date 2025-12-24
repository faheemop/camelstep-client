import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "../../Text/Text";
import { CartItem } from "../CartItem/CartItem";

import "./cartItemsList.scss";

export const CartItemsList = ({ cartItems, packageItems, previousCartItems }) => {
  const { t } = useTranslation("application");
  const [productCounter, setProductCounter] = useState({});
  const [packageCounter, setPackageCounter] = useState({});

  const calculateCounter = (items, setCounter) => {
    if (!items?.length) return;
    const tmp = {};
    items.forEach((element) => {
      const itemId = element.product_id || element.package_id;
      if (!tmp[itemId]) {
        // eslint-disable-next-line immutable/no-mutation
        tmp[itemId] = element.quantity;
        return;
      }
      // eslint-disable-next-line immutable/no-mutation
      tmp[itemId] += element.quantity;
    });
    setCounter(tmp);
  };

  useEffect(() => {
    if (!cartItems?.length) return;
    calculateCounter(cartItems, setProductCounter);

    if (!packageItems?.length) return;
    calculateCounter(packageItems, setPackageCounter);
  }, [cartItems, packageItems]);

  const renderCartItems = () => {
    const productItems = cartItems?.map((item, i) => (
      <CartItem
        key={`${item.name}/${i}`}
        item={item}
        maxTotal={productCounter[item.product_id]}
      />
    ));
    const packageCartItems = packageItems?.map((item, i) => (
      <CartItem
        key={`${item.name}/${i}`}
        item={item}
        maxTotal={packageCounter[item.package_id]}
        isPackage={true}
      />
    ));

    const previousItems =
      previousCartItems?.length > 0 ? (
        <div>
          <Text type="headline2">
            <a href="/" className="cart__link">
              {t("common.previousCart")}
            </a>
          </Text>
          <div className="cart__divider" />
          {previousCartItems.map((item, i) => (
            <CartItem
              key={`previous-${item.name}-${i}`}
              item={item}
              maxTotal={productCounter[item.product_id]}
              previousItem={true}
            />
          ))}
        </div>
      ) : null;

    return (
      <>
        {productItems}
        {packageCartItems}
        {previousItems}
      </>
    );
  };

  return (
    <div className="cart-items-list">
      {!cartItems?.length > 0 && !packageItems?.length > 0 && !previousCartItems.length ? (
        <Text
          style={{ margin: "3rem 0", textAlign: "center" }}
          type="headline3"
        >
          {t("cart.empty")}
        </Text>
      ) : (
        renderCartItems()
      )}
    </div>
  );
};
