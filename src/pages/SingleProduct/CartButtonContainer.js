import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Button } from '../../components/common/Button/Button';
import { buildErrorMsg } from '../../helpers/errorHelpers';
import {
  useCreateCartPackageMutation, useCreateCartProductMutation, useLazyGetCartProductsQuery, useUnlockCartMutation,
} from '../../services/cart';
import { notify } from '../../utils/notifications';
import { setCurrentStep, setDiscountCode, setPendingPayment } from '../../features/checkout/checkoutSlice';
import { RiyalSymbol } from '../../components/RiyalSymbol/RiyalSymbol';

export const CartButtonContainer = ({
  product,
  totalPrice,
  productCount,
  activeModificators,
  variantValues,
  setError,
  isButtonDisabled,
  packageData,
}) => {
  const { t } = useTranslation('application');
  const [addToCart, { isSuccess, error: { data: { errors } = {} } = {} }] = _.isEmpty(packageData) ? useCreateCartProductMutation() : useCreateCartPackageMutation();
  const checkoutCurrentStep = useSelector((state) => state.checkout.currentStep);
  const isCartLocked = useSelector((state) => state.cart.isLocked);
  const dispatch = useDispatch();
  const [unlockCart] = useUnlockCartMutation();
  const [trigger] = useLazyGetCartProductsQuery();

  const handleCartUnlock = async () => {
    dispatch(setCurrentStep(1));
    dispatch(setPendingPayment(false));
    dispatch(setDiscountCode(null));
    await unlockCart();
  };

  const handleAddToCart = async () => {
    const isEveryVariantSelected = variantValues?.every((variant) => variant.variantValueId !== 'none');

    if (isCartLocked) {
      await handleCartUnlock();
    }

    if (!isEveryVariantSelected) {
      setError(t('products.product.variantRequired'));
      return;
    }
    setError('');

    const pickedVariants = variantValues
      ?.filter((variant) => variant.variantValueId !== 'none')
      ?.map((variant) => ({
        product_variant_id: variant.variantId,
        product_variant_value_id: parseInt(variant.variantValueId, 10),
      }));

    const pickedModificators = activeModificators
      ?.filter((modificator) => modificator.checked)
      ?.map((modificator) => ({
        product_modificator_id: modificator.modificatorId,
      }));

    const addToCartSchema = {
      product_id: product.id,
      quantity: productCount,
      ...(pickedVariants.length > 0 && { cart_product_variants_attributes: pickedVariants }),
      ...(pickedModificators.length > 0 && { cart_product_modificators_attributes: pickedModificators }),
    };

    await addToCart(addToCartSchema);

    if (isCartLocked) {
      await trigger();
    }

    if (checkoutCurrentStep === 2) {
      dispatch(setCurrentStep(1));
    }
  };

  const handlePackageToCart = async () => {
    const addPackageToCartSchema = {
      package_id: packageData.id,
      quantity: productCount,
      package_products: packageData.package_products,
    };

    await addToCart(addPackageToCartSchema);
  };

  const submitCart = () => {
    if (!_.isEmpty(packageData)) handlePackageToCart();
    else handleAddToCart();
  };

  useEffect(() => {
    if (errors) {
      setError(buildErrorMsg(errors));
    } else {
      setError(null);
    }
  }, [errors]);

  useEffect(() => {
    if (isSuccess) {
      notify(t('cart.addToCartSuccess'), 'success');
    }
  }, [isSuccess]);

  return (
    <Button
      type="primary"
      text={(
        <div className="add-to-cart-container">
          {t('common.addToCart')}
          {' - '}
          <div className="text__rtl">
            {totalPrice}
            {' '}
            <RiyalSymbol size={13} color="white" />
          </div>
        </div>
    )}
      className="product-box__add-to-cart"
      onClick={submitCart}
      disabled={isButtonDisabled}
    />
  );
};
