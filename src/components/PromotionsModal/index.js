import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useGetPromotionsQuery } from "../../services/promotions";
import { eventBus } from "../../helpers/eventBus";
import { Text } from "../Text/Text";
import "./promotionModal.scss";

export const PromotionsModal = () => {
  const [activePromotion, setActivePromotion] = useState(null);
  const { data: promotionsData } = useGetPromotionsQuery();
  const { t } = useTranslation("application");
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const getPromotionContent = (promotion) => {
    const title =
      currentLanguage === "ar" ? promotion?.title_ar : promotion?.title_en;
    return (
      <div className="promotions-modal">
        <img
          src={`${process.env.API_ROOT}${promotion?.banner_image}`}
          alt={title}
        />
      </div>
    );
  };

  useEffect(() => {
    const hasPromotionModalBeenShown = sessionStorage.getItem(
      "promotionModalShown"
    );
    if (!_.isEmpty(promotionsData)) {
      const promotion = _.find(promotionsData?.records, { status: "enabled" });
      if (
        !_.isEmpty(promotion) &&
        promotion.banner_image &&
        !hasPromotionModalBeenShown
      ) {
        const timeoutId = setTimeout(() => {
          eventBus.publish("modal:open", {
            body: getPromotionContent(promotion),
          });
          sessionStorage.setItem("promotionModalShown", true);
        }, 2000);
        return () => clearTimeout(timeoutId);
      }
    }
    return () => {};
  }, [promotionsData]);

  useEffect(() => {
    if (promotionsData) {
      const promotion = _.find(promotionsData?.records, { status: "enabled" });

      if (promotion && new Date(promotion.expired_at) > new Date()) {
        setActivePromotion(promotion);
      }
    }
  }, [promotionsData]);

  const calculateDaysLeft = (expiredAt) => {
    const expirationDate = new Date(expiredAt);
    const currentDate = new Date();
    const timeDifference = expirationDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const title =
    currentLanguage === "ar"
      ? activePromotion?.title_ar
      : activePromotion?.title_en;

  return (
    activePromotion && (
      <div className="promotion-banner-container">
        <Text type="subtitle1" className="promotion-label">
          {title}
        </Text>
        {/* <span className="space" />
        {activePromotion.expired_at && (
          <Text type="headline2" className="promotion-label">
            {t('promotion.expiresLabel')}
            {' '}
            {calculateDaysLeft(activePromotion.expired_at)}
            {' '}
            {t('promotion.daysLabel')}
          </Text>
        )} */}
      </div>
    )
  );
};
