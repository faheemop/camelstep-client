import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "../../components/Text/Text";
import { RiyalSymbol } from "../../components/RiyalSymbol/RiyalSymbol";

const formattedPrice = (price) => {
  const number = parseFloat(price).toFixed(2);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const ProductPrice = ({ totalPrice, quantity, vatPrice }) => {
  const { t, i18n } = useTranslation("application");

  const currentLanguage = i18n.language;

  const priceExcludingVAT = formattedPrice(
    parseFloat(totalPrice) - parseFloat(vatPrice) * parseFloat(quantity)
  );

  return (
    <>
      <Text type="headline2" className="product-box__price text__rtl">
        {formattedPrice(totalPrice)}
        <RiyalSymbol size={23} color="blue" />
      </Text>
      <Text type="subtitle2" className="product__vat-info">
        {t("products.product.priceInclVat")} (
        {t("products.product.priceExecVatSar")}
        <div
          className={`text__rtl ${
            currentLanguage === "en" ? "margin-left" : "margin-right"
          }`}
        >
          {priceExcludingVAT} <RiyalSymbol size={9} />
        </div>
        )
      </Text>
    </>
  );
};
