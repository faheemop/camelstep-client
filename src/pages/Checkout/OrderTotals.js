import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useGetCartProductsQuery } from "../../services/cart";
import { OrderTotalPrice } from "../../components/Order/OrderTotalPrice";
import { displayPrice } from "../../helpers/displayPrice";

export const OrderTotals = () => {
  const { t } = useTranslation("application");
  const { data } = useGetCartProductsQuery();
  const currentStep = useSelector((state) => state.checkout.currentStep);

  const {
    shipmentPrice,
    discountValue,
    totalPrice,
    summaryPrice,
    vatPrice,
    estimatedVatPrice,
  } = useSelector((state) => state.checkout.orderPrices);
  const paymentData = useSelector((state) => state.checkout.paymentData);
  const { discountCode } = useSelector((state) => state.checkout);

  const shipment = shipmentPrice || paymentData?.order?.shipmentPrice;
  const discount = discountValue || paymentData?.order?.discountValue;
  const vat = paymentData?.order?.vatPrice || vatPrice;
  const total = paymentData?.order?.totalPrice || totalPrice;
  const summary = paymentData?.order?.summaryPrice || summaryPrice;

  const parsedShipmentPrice = parseFloat(shipment || 0);
  const parsedDiscountValue = parseFloat(discount || 0);
  const parsedVatPrice = parseFloat(vat || 0);
  const parsedEstimatedVatPrice = +parseFloat(
    data?.estimated_vat_price || estimatedVatPrice || 0
  ).toFixed(2);
  const calcBaseTotal = (base) =>
    parsedEstimatedVatPrice ? base + parsedEstimatedVatPrice : base;
  const parsedTotalPrice = parseFloat(total || data?.total_price);
  const parsedSummaryPrice = parseFloat(summary || data?.total_price);

  const calcTotal = () => {
    switch (currentStep) {
      case 1:
        return calcBaseTotal(parsedTotalPrice) + parsedShipmentPrice;
      case 2:
        return (
          summary ||
          parsedSummaryPrice +
            parsedShipmentPrice -
            parsedDiscountValue +
            parsedVatPrice
        );
      default:
        return (
          summary ||
          parsedSummaryPrice +
            parsedShipmentPrice -
            parsedDiscountValue +
            parsedVatPrice
        );
    }
  };

  return (
    <div className="order-totals">
      {!!parsedTotalPrice && (
        <OrderTotalPrice
          variant="secondary"
          totalLabel={t("prices.subtotal")}
          totalPrice={displayPrice(parsedTotalPrice)}
          bold
        />
      )}
      {!!(parsedShipmentPrice && parsedShipmentPrice !== 0) &&
        currentStep >= 1 && (
          <OrderTotalPrice
            variant="secondary"
            totalLabel={t("prices.deliveryFee")}
            totalPrice={displayPrice(parsedShipmentPrice)}
            bold
          />
        )}
      {paymentData?.order?.vatPrice ? (
        <OrderTotalPrice
          variant="secondary"
          totalLabel={t("prices.vat")}
          totalPrice={displayPrice(parseFloat(paymentData?.order?.vatPrice))}
          bold
        />
      ) : (
        parseFloat(estimatedVatPrice) !== 0 &&
        !!estimatedVatPrice && (
          <OrderTotalPrice
            variant="secondary"
            totalLabel={t("prices.vat")}
            totalPrice={displayPrice(parsedEstimatedVatPrice)}
            bold
          />
        )
      )}
      {!!parsedDiscountValue && (
        <OrderTotalPrice
          variant="discount"
          totalLabel={t("prices.discount")}
          totalPrice={displayPrice(parsedDiscountValue)}
          bold
        />
      )}
      {!!parsedSummaryPrice && (
        <OrderTotalPrice
          variant="primary"
          totalLabel={t("prices.total")}
          totalPrice={displayPrice(calcTotal())}
        />
      )}
    </div>
  );
};
