import React from "react";

import CartIcon from "../../assets/icons/cart-icon.svg";
import {
  useGetCartPackagesQuery,
  useGetCartProductsQuery,
} from "../../services/cart";
import { Button } from "../common/Button/Button";
import { ProductCountBadge } from "../ProductCountBadge/ProductCountBadge";

import "./countCartIcon.scss";

export const CountCartIcon = ({ onClick, className }) => {
  const { data } = useGetCartProductsQuery();
  const { data: packageItems } = useGetCartPackagesQuery();

  const totalProducts = data?.records?.length || null;
  const totalPackages = packageItems?.records?.length || null;

  return (
    <Button
      className="btn-cart"
      icon={<CartIcon className={className} />}
      onClick={onClick}
    >
      {(totalProducts || totalPackages) && (
        <ProductCountBadge count={totalProducts + totalPackages} />
      )}
    </Button>
  );
};
