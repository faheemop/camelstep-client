import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../components/common/Button/Button';
import { SvgIcon } from '../../../components/common/SvgIcon/SvgIcon';
import { Text } from '../../../components/Text/Text';
import { UnresolvedProduct } from '../../../components/UnresolvedProducts/UnresolvedProduct';
import { setShipmentOption, setUncompletedPackages } from '../../../features/checkout/checkoutSlice';
import { eventBus } from '../../../helpers/eventBus';
import {
  useDeleteCartProductMutation,
  useGetCartProductsQuery,
  useUpdateCartProductMutation,
} from '../../../services/cart';

import './unresolvedProductsModal.scss';

export const UnresolvedProductsModal = ({ products, refetch }) => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const { data: cartItems } = useGetCartProductsQuery();
  const [updateCartProduct] = useUpdateCartProductMutation();
  const [deleteCartProduct] = useDeleteCartProductMutation();
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);
  const availableServices = useSelector((state) => state.checkout.availableServices);
  const otherShipmentOption = shipmentOption === 'delivery' ? t('unresolvedProducts.pickup') : t('unresolvedProducts.delivery');

  const filterOutProducts = () => {
    const copyUnresolved = [...products];

    const result = cartItems.records.filter((cartItem) => products.some((unresolvedItem) => unresolvedItem.id === cartItem.product_id))
      .map((cartItem) => {
        const item = copyUnresolved.find((unresolvedItem) => unresolvedItem.id === cartItem.product_id);
        const index = copyUnresolved.indexOf(item);
        copyUnresolved.splice(index, 1);
        return {
          ...cartItem,
          desired_quantity: item.desired_quantity,
        };
      });

    const promises = [];
    result.forEach((item) => {
      if (item.quantity - item.desired_quantity === 0) {
        promises.push(
          deleteCartProduct({
            id: item.id,
          }),
        );
      } else {
        promises.push(
          updateCartProduct({
            id: item.id,
            body: {
              quantity: item.quantity - 1,
            },
          }),
        );
      }
    });
    Promise.allSettled(promises).then(() => {
      dispatch(setUncompletedPackages([]));
      refetch();
      eventBus.publish('modal:close');
    });
  };

  const unresolvedFromCart = useRef(products.map((product) => {
    if (product?.tags?.length > 0) return product;
    const idx = cartItems.records.findIndex((item) => item.product_id === product.id);
    if (idx) {
      return {
        ...product,
        tags: cartItems.records[idx]?.tags,
      };
    }
    return product;
  }));

  const hasOutOfStock = unresolvedFromCart.current.filter((product) => (!product.is_purchasable || product.tags.findIndex((tag) => tag.key === 'out_of_stock') >= 0));

  const filterOutOfStockProducts = () => {
    const result = [...hasOutOfStock];

    const promises = [];

    result.forEach((item) => {
      promises.push(
        deleteCartProduct({
          id: cartItems.records.filter(({ product_id }) => product_id === item.id)[0].id,
        }),
      );
    });
    Promise.allSettled(promises).then(() => {
      // eslint-disable-next-line immutable/no-mutation
      unresolvedFromCart.current = unresolvedFromCart.current.filter((product) => result.findIndex((el) => el.id === product.id) < 0);
      dispatch(setUncompletedPackages([]));
      refetch();
    });
  };

  const handleContinue = () => {
    eventBus.publish('modal:close');
    const shipmentOptionToSet = availableServices.filter((option) => shipmentOption !== option);
    dispatch(setShipmentOption(shipmentOptionToSet[0]));
  };

  return (
    <div className="unresolved-products-modal">
      <Text className="unresolved-products-modal__info" type="body1">
        {t('unresolvedProducts.info', { shipmentOption, count: products.length })}
      </Text>
      {unresolvedFromCart.current.map((product, index) => (
        <UnresolvedProduct key={index} item={product} />
      ))}
      <div className="unresolved-product-modal__actions">
        <Button type="primary" onClick={filterOutProducts} text={t('unresolvedProducts.remove')}>
          <SvgIcon id="icon-delete" width={32} height={32} />
        </Button>
        {hasOutOfStock?.length >= 1 && (
          <Button type="primary" onClick={filterOutOfStockProducts} text={`${t('unresolvedProducts.remove')}: ${t('badge.outofstock')}`}>
            <SvgIcon id="icon-delete" width={32} height={32} />
          </Button>
        )}
        <Button type="primary" inverted disabled={hasOutOfStock?.length >= 1} onClick={handleContinue}>
          {`${t('unresolvedProducts.continueWith')} ${otherShipmentOption}`}
        </Button>
      </div>
    </div>
  );
};
