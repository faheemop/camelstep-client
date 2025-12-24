import React from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../../hooks/useCurrentScreenWidth";
import { Expandable } from "../../common/Expandable/Expandable";
import BeanIcon from "../../../assets/icons/bean.svg";
import { Text } from "../../Text/Text";

export const CartItemBeanInfo = ({ productType }) => {
  const { t } = useTranslation("application");
  const lessThan575 = useMediaQuery("(max-width: 575px)");

  if (productType === "coffee") {
    return lessThan575 ? (
      <Expandable
        variant="accordion"
        label={
          <>
            <BeanIcon style={{ overflow: "inherit" }} />
            {t("products.product.readInfo")}
          </>
        }
      >
        <Text type="body1" className="summary-item__hint-text">
          {t("products.product.beansInfo")}
        </Text>
      </Expandable>
    ) : (
      <>
        <BeanIcon />
        <Text type="body2">{t("products.product.beansInfo")}</Text>
      </>
    );
  }
  return null;
};
