import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-grid-system";
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import { Text } from "../../components/Text/Text";
import { useMediaQuery } from "../../hooks/useCurrentScreenWidth";
import { Badge } from "../../components/common/Badge/Badge";
import { ProductImage } from "../../components/ProductImage/ProductImage";
import { RiyalSymbol } from "../../components/RiyalSymbol/RiyalSymbol";
import { localizedPath } from "../../helpers/localizedPath";

export const NeededProductsSection = ({ neededProducts }) => {
  const { t, i18n } = useTranslation("application", {
    keyPrefix: "products.product",
  });
  const moreThan1024 = useMediaQuery("(min-width: 1024px)");
  const moreThan576 = useMediaQuery("(min-width: 576px)");

  const calculateSlidesPerView = () => {
    if (moreThan1024) {
      return 6;
    }
    if (moreThan576) {
      return 3;
    }
    return 2;
  };

  const getProductName = (product) => {
    const name = product?.name;
    if (!name) return "";

    return name.length > 25 ? name.substring(0, 25).trim() + "..." : name;
  };

  const getProductDescription = (product) => {
    const isArabic = i18n.language === "ar";

    const shortDesc = isArabic
      ? product.short_description_ar
      : product.short_description;

    if (shortDesc) return shortDesc;

    const fullDesc = isArabic
      ? product.description_ar || product.description
      : product.description;

    if (fullDesc) return fullDesc.slice(0, 50) + "...";

    return "\u00A0";
  };

  if (neededProducts.length > 0) {
    return (
      <Row style={{ paddingBottom: "10vmin" }}>
        <Col sm={12}>
          <Text type="headline2">{t("mightNeed")}</Text>
          <Swiper
            slidesPerView={calculateSlidesPerView()}
            loop={!(neededProducts.length <= calculateSlidesPerView())}
          >
            {neededProducts.map((product, index) => (
              <SwiperSlide key={index}>
                <Link
                  to={localizedPath(`/products/${product.slug || product.id}`)}
                  className="other-stuff-item"
                >
                  <div className="other-stuff-item__badge-container">
                    {product.tags.length > 0 &&
                      product.tags.map((tag, i) => (
                        <Badge key={i} type={tag.key} />
                      ))}
                  </div>
                  <ProductImage
                    source={product.image_url}
                    alt="product you might need"
                    className="other-stuff-item__image"
                  />
                  <div className="other-stuff-item__content">
                    <Text type="body1" className="other-stuff-item__name">
                      {getProductName(product)}
                    </Text>
                    <Text type="body2" className="product__dummy">
                      {getProductDescription(product)}
                    </Text>
                    <Text
                      type="body1"
                      className="other-stuff-item__price text__rtl"
                    >
                      {+product.list_price + +product?.vat_price}{" "}
                      <RiyalSymbol size={14} />
                    </Text>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
      </Row>
    );
  }
  return null;
};
