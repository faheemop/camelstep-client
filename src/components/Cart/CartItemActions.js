import React, { useEffect, useRef, useState } from "react";
import { Hidden } from "react-grid-system";
import { useSelector, useDispatch } from "react-redux";

import { SvgIcon } from "../common/SvgIcon/SvgIcon";
import { getInStockQuantity } from "../../helpers/productHelpers";
import { useDebounce } from "../../hooks/useDebounce";
import {
  useDeleteCartPackageMutation,
  useDeleteCartProductMutation,
  useUnlockCartMutation,
  useUpdateCartPackageMutation,
  useUpdateCartProductMutation,
} from "../../services/cart";
import { Button } from "../common/Button/Button";
import { QuantityInput } from "../common/QuantityInput/QuantityInput";
import { notify } from "../../utils/notifications";
import { buildErrorMsg } from "../../helpers/errorHelpers";
import {
  setCurrentStep,
  setDiscountCode,
  setPendingPayment,
} from "../../features/checkout/checkoutSlice";

import "./cartItemActions.scss";

export const CartItemActions = ({ item, maxTotal }) => {
  const [handleProductDelete] = useDeleteCartProductMutation();
  const [handleProductUpdate] = useUpdateCartProductMutation();
  const [handlePackageDelete] = useDeleteCartPackageMutation();
  const [handlePackageUpdate] = useUpdateCartPackageMutation();
  const [quantity, setQuantity] = useState(item.quantity);
  const isMounted = useRef(false);
  const isBlocked = useRef(false);
  const checkoutCurrentStep = useSelector(
    (state) => state.checkout.currentStep
  );
  const isCartLocked = useSelector((state) => state.cart.isLocked);
  const [unlockCart] = useUnlockCartMutation();
  const dispatch = useDispatch();

  const handleCartUnlock = async () => {
    dispatch(setCurrentStep(1));
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    await unlockCart();
  };

  const handleCartItemUpdate = async (productQuantity) => {
    const updateSchema = {
      quantity: productQuantity,
    };

    if (isCartLocked) {
      await handleCartUnlock();
    }

    const { error: { data: { errors } = {} } = {} } = item?.package_products
      ? await handlePackageUpdate({
          id: item.id,
          body: updateSchema,
        })
      : await handleProductUpdate({
          id: item.id,
          body: updateSchema,
        });

    /* eslint-disable immutable/no-mutation */
    if (errors) {
      notify(buildErrorMsg(errors), "warning");
      isBlocked.current = true;
      setQuantity(item.quantity);
    }

    if (checkoutCurrentStep === 3) {
      dispatch(setCurrentStep(1));
    }
  };

  const handleRemoveProductFromCart = async () => {
    if (isCartLocked) {
      await handleCartUnlock();
    }
    const { error: { data: { errors } = {} } = {} } = item?.package_products
      ? await handlePackageDelete({ id: item.id })
      : await handleProductDelete({ id: item.id });

    if (errors) {
      notify(buildErrorMsg(errors), "warning");
    }

    if (checkoutCurrentStep === 3) {
      dispatch(setCurrentStep(1));
    }
  };

  const debouncedCartItemQuantity = useDebounce(quantity, 500);

  /* eslint-disable immutable/no-mutation */
  useEffect(() => {
    if (isMounted.current) {
      if (!isBlocked.current) {
        handleCartItemUpdate(debouncedCartItemQuantity);
      } else {
        isBlocked.current = false;
      }
    } else {
      isMounted.current = true;
    }
  }, [debouncedCartItemQuantity]);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item]);

  return (
    <div className="cart-item-actions">
      <QuantityInput
        small
        initialValue={quantity}
        onQuantityChange={setQuantity}
        maxQuantity={getInStockQuantity(item.quantity_available)}
        maxTotal={maxTotal}
      />
    </div>
  );
};
