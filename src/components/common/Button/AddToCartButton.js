import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './Button';
import { PlusButton } from './PlusButton';
import {
  useCreateCartPackageMutation, useCreateCartProductMutation, useLazyGetCartProductsQuery, useUnlockCartMutation,
} from '../../../services/cart';
import { notify } from '../../../utils/notifications';
import { buildErrorMsg } from '../../../helpers/errorHelpers';
import { setCurrentStep, setDiscountCode, setPendingPayment } from '../../../features/checkout/checkoutSlice';
import { localizedPath } from '../../../helpers/localizedPath';

export const AddToCartButton = ({
  productId, hasAddons, buttonType = 'standard',
  disabled, buttonText, isPackage, slug,
}) => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();
  const [addToCart, { isSuccess }] = isPackage ? useCreateCartPackageMutation() : useCreateCartProductMutation();
  const [trigger] = useLazyGetCartProductsQuery();
  const [unlockCart] = useUnlockCartMutation();

  const checkoutCurrentStep = useSelector((state) => state.checkout.currentStep);
  const isCartLocked = useSelector((state) => state.cart.isLocked);
  const dispatch = useDispatch();

  const handleCartUnlock = async () => {
    dispatch(setCurrentStep(1));
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    await unlockCart();
  };

  const handleAddToCart = async (id) => {
    const addToCartSchema = { quantity: 1 };
    if (isCartLocked) {
      await handleCartUnlock();
    }

    /* eslint-disable immutable/no-mutation */
    if (isPackage) addToCartSchema.package_id = id;
    else addToCartSchema.product_id = id;

    if (hasAddons) {
      navigate(localizedPath(`/products/${slug || productId}`));
    } else {
      const { error: { data: { errors } = {} } = {} } = await addToCart(addToCartSchema);
      if (isCartLocked) {
        await trigger();
      }
      if (errors) {
        notify(buildErrorMsg(errors), 'warning');
      }

      if (checkoutCurrentStep === 2) {
        dispatch(setCurrentStep(1));
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notify(t('cart.addToCartSuccess'), 'success');
    }
  }, [isSuccess]);

  const addToCartHelper = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    handleAddToCart(productId);
  };

  if (buttonType === 'plus') {
    return <PlusButton disabled={disabled} onClick={addToCartHelper} />;
  }

  if (buttonType === 'standard') {
    return (
      <Button
        disabled={disabled}
        text={buttonText || t('common.addToCart')}
        type="primary"
        onClick={addToCartHelper}
        className="add-to-cart-button"
      />
    );
  }

  if (buttonType === 'secondary') {
    return (
      <Button
        disabled={disabled}
        text={buttonText || t('common.addToCart')}
        type="naked"
        onClick={addToCartHelper}
        className="add-to-cart-button-underlined"
      />
    );
  }
  return null;
};
