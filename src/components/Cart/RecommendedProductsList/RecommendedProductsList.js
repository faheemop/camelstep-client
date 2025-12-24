import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
/* eslint-disable import/no-unresolved */
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import { Text } from "../../Text/Text";
import { OtherProductsItem } from "../../OtherProducts/OtherProductsItem";
import { useMediaQuery } from "../../../hooks/useCurrentScreenWidth";

import "./recommendedProductsList.scss";

export const RecommendedProductsList = ({ data }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { t } = useTranslation("application");
  const moreThan576 = useMediaQuery("(min-width: 576px)");

  return (
    <div className="recommended-products">
      <Text
        className="recommended-products__text"
        type="body1"
        style={{ marginBottom: "2rem" }}
      >
        {t("products.youWillNeed")}
      </Text>
      <div className="recommended-products__list">
        <button
          type="button"
          ref={prevRef}
          className="swiper-button-prev"
          aria-label={t("carousel.previous")}
        />
        <button
          type="button"
          ref={nextRef}
          className="swiper-button-next"
          aria-label={t("carousel.next")}
        />
        <Swiper
          slidesPerView={moreThan576 ? 3 : 2}
          centeredSlides={!moreThan576}
          loop
          navigation={{
            nextEl: nextRef.current,
            prevEl: prevRef.current,
          }}
          modules={[Navigation]}
        >
          {data.map((prod) => (
            <SwiperSlide key={prod.id}>
              <OtherProductsItem item={prod} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
