// hooks/useAddToCart.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
// import {
//   useCreateCartPackageMutation,
//   useCreateCartProductMutation,
//   useLazyGetCartProductsQuery,
//   useUnlockCartMutation,
// } from "../../services/cart";
// import { notify } from "../../utils/notifications";
// import { buildErrorMsg } from "../../helpers/errorHelpers";
// import {
//   setCurrentStep,
//   setDiscountCode,
//   setPendingPayment,
// } from "../../features/checkout/checkoutSlice";
// import { localizedPath } from "../../helpers/localizedPath";
import {
  useCreateCartPackageMutation,
  useCreateCartProductMutation,
  useLazyGetCartProductsQuery,
  useUnlockCartMutation,
} from "../../../services/cart";
import { notify } from "../../../utils/notifications";
import { buildErrorMsg } from "../../../helpers/errorHelpers";
import {
  setCurrentStep,
  setDiscountCode,
  setPendingPayment,
} from "../../../features/checkout/checkoutSlice";
import { localizedPath } from "../../../helpers/localizedPath";

export const useAddToCart = ({ productId, hasAddons, slug, isPackage }) => {
  const { t } = useTranslation("application");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addToCart, { isSuccess }] = isPackage
    ? useCreateCartPackageMutation()
    : useCreateCartProductMutation();
  const [trigger] = useLazyGetCartProductsQuery();
  const [unlockCart] = useUnlockCartMutation();

  const checkoutCurrentStep = useSelector(
    (state) => state.checkout.currentStep
  );
  const isCartLocked = useSelector((state) => state.cart.isLocked);

  const handleCartUnlock = async () => {
    dispatch(setCurrentStep(1));
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    await unlockCart();
  };

  const handleAddToCart = async () => {
    const schema = { quantity: 1 };

    if (isCartLocked) {
      await handleCartUnlock();
    }

    if (isPackage) schema.package_id = productId;
    else schema.product_id = productId;

    if (hasAddons) {
      navigate(localizedPath(`/products/${slug || productId}`));
    } else {
      const { error: { data: { errors } = {} } = {} } = await addToCart(schema);
      if (isCartLocked) {
        await trigger();
      }
      if (errors) {
        notify(buildErrorMsg(errors), "warning");
      }
      if (checkoutCurrentStep === 2) {
        dispatch(setCurrentStep(1));
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notify(t("cart.addToCartSuccess"), "success");
    }
  }, [isSuccess]);

  return handleAddToCart;
};
