import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-grid-system";
import { useTranslation } from "react-i18next";
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from "swiper/react";

import { Badge } from "../../components/common/Badge/Badge";
import { Text } from "../../components/Text/Text";
import { useMediaQuery } from "../../hooks/useCurrentScreenWidth";
import { ProductImage } from "../../components/ProductImage/ProductImage";
import { RiyalSymbol } from "../../components/RiyalSymbol/RiyalSymbol";
import { localizedPath } from "../../helpers/localizedPath";

export const SimilarProducts = ({ similarProducts }) => {
  const { t, i18n } = useTranslation("application");

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

  const getPrice = (product) => {
    return +product.list_price + +product.vat_price;
  };

  if (similarProducts?.length > 0) {
    return (
      <Row style={{ paddingBottom: "10vmin" }}>
        <Col sm={12}>
          <Text type="headline2">{t("products.product.moreCoffees")}</Text>
          {similarProducts && similarProducts.length > 0 && (
            <Swiper
              slidesPerView={calculateSlidesPerView()}
              loop={!(similarProducts.length <= calculateSlidesPerView())}
            >
              {similarProducts?.map((product, index) => (
                <SwiperSlide key={index}>
                  <Link
                    to={localizedPath(
                      `/products/${product.slug || product.id}`
                    )}
                    className="other-stuff-item"
                    // Ensures the link container handles vertical stacking correctly
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div className="other-stuff-item__badge-container">
                      {product.tags.length > 0 &&
                        product.tags.map((tag, i) => (
                          <Badge key={i} type={tag.key} />
                        ))}
                    </div>

                    {/* FIXED: Added style prop to enforce height and alignment */}
                    <ProductImage
                      source={product.image_url}
                      alt="other product"
                      className="other-stuff-item__image"
                      style={{
                        height: "220px", // Fixes the height for all images
                        width: "100%", // Ensures image uses available width
                        objectFit: "contain", // Keeps aspect ratio without cropping
                        marginTop: "10px", // Adds spacing from the badge
                        marginBottom: "10px", // Adds spacing before the title
                      }}
                    />

                    <div className="other-stuff-item__content">
                      <Text type="body1" className="other-stuff-item__name">
                        {product.name}
                      </Text>
                      <Text type="body2" className="product__dummy">
                        {i18n.language === "ar"
                          ? product.short_description_ar ||
                            (product.description
                              ? product.description.slice(0, 50) + "..."
                              : "\u00A0")
                          : product.short_description ||
                            (product.description
                              ? product.description.slice(0, 50) + "..."
                              : "\u00A0")}
                      </Text>
                      <Text
                        type="body1"
                        className="other-stuff-item__price text__rtl"
                      >
                        {getPrice(product).toFixed(2)} <RiyalSymbol size={12} />
                      </Text>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Col>
      </Row>
    );
  }
  return null;
};
