import React from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../hooks/useCurrentScreenWidth";
import { ProductBadges } from "../Product/ProductBadges";
import { useProductImage } from "../ProductImage/useProductImage";
import { ProductPreview } from "../ProductPreview/ProductPreview";
import { Text } from "../Text/Text";

import "./summaryItem.scss";
import { RiyalSymbol } from "../RiyalSymbol/RiyalSymbol";
import { useSelector } from "react-redux";

const formatVariants = (productVariants) =>
  productVariants
    .map((variant) => `${variant.name}: ${variant.value}`)
    .join(", ");

const formatModificators = (productmodificators) =>
  productmodificators.map((modificator) => `${modificator.name}`).join(", ");

export const SummaryItem = ({
  id,
  name,
  tags,
  image_url,
  quantity,
  totalQuantityPrice,
  vatPrice,
  variants,
  modificators,
  totalQuantityDiscountPrice,
  discountPercentageValue,
}) => {
  const { t } = useTranslation("application");
  const max575 = useMediaQuery("(max-width: 575px)");

  const { productImage } = useProductImage(id, variants);
  const { discountCode } = useSelector((state) => state.checkout);
  console.log("-----------", discountCode);
  return (
    <div className="summary-item" id="item">
      <div className="summary-item__container">
        <div className="summary-item__product-view">
          {!max575 && <ProductBadges badges={tags} />}
          <ProductPreview
            productImage={productImage || image_url}
            productCount={parseInt(quantity, 10)}
          />
        </div>
        <div>
          <div className="summary-item__product-info">
            <Text className="summary-item__name" type="headline2">
              {name}
            </Text>
            {variants.length > 0 && (
              <Text type="subtitle2">{formatVariants(variants)}</Text>
            )}
            {modificators.length > 0 && (
              <Text type="subtitle2">{formatModificators(modificators)}</Text>
            )}

            <div className="summary-item__price-view">
              {discountCode && (
                <Text className="summary-item__price text__rtl" type="body2">
                  {totalQuantityDiscountPrice &&
                  parseFloat(totalQuantityDiscountPrice) !== 0
                    ? parseFloat(totalQuantityDiscountPrice).toFixed(2)
                    : (
                        parseFloat(totalQuantityPrice) +
                        (vatPrice
                          ? parseFloat(vatPrice) * parseFloat(quantity)
                          : 0) -
                        parseFloat(totalQuantityDiscountPrice || 0)
                      ).toFixed(2)}{" "}
                  <RiyalSymbol size={9} />
                </Text>
              )}

              {discountCode &&
                totalQuantityDiscountPrice &&
                Number.parseFloat(totalQuantityDiscountPrice) !== 0 && (
                  <Text
                    className="summary-item__dicount-price text__rtl"
                    type="overline"
                  >
                    {(
                      parseFloat(totalQuantityPrice) +
                      (vatPrice
                        ? parseFloat(vatPrice) * parseFloat(quantity)
                        : 0)
                    ).toFixed(2)}{" "}
                    <RiyalSymbol size={9} />
                  </Text>
                )}
              {!discountCode && (
                <Text className="summary-item__price text__rtl" type="body2">
                  {(
                    parseFloat(totalQuantityPrice) +
                    (vatPrice ? parseFloat(vatPrice) * parseFloat(quantity) : 0)
                  ).toFixed(2)}{" "}
                  <RiyalSymbol size={9} />
                </Text>
              )}

              {discountCode &&
                discountPercentageValue &&
                Number.parseFloat(discountPercentageValue) !== 0 && (
                  <Text className="summary-item__price" type="body4">
                    {`${discountPercentageValue} % OFF`}
                  </Text>
                )}
            </div>

            {vatPrice && parseFloat(vatPrice) !== 0 && (
              <Text className="summary-item" type="body3">
                {t("products.product.vatIncluded")}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
