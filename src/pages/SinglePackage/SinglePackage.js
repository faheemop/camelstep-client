import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Container, Row, Col } from "react-grid-system";
import _ from "lodash";
import { Text } from "../../components/Text/Text";
import { MainLayout } from "../../components/Layout/MainLayout";
import { useMediaQuery } from "../../hooks/useCurrentScreenWidth";
import { PackageProducts } from "./PackageProducts";
import { calculateTotalPrice } from "../../helpers/productHelpers";
import { ProductPrice } from "../SingleProduct/ProductPrice";
import { ModificatorsContainer } from "../SingleProduct/ModificatorsContainer";
import { Alert } from "../../components/common/Alert/Alert";
import { Vatinfo } from "../../components/VatInfo/Vatinfo";
import { ProductImage } from "../../components/ProductImage/ProductImage";
import { CartButtonContainer } from "../SingleProduct/CartButtonContainer";

import "../SingleProduct/SingleProduct.scss";
import { RiyalSymbol } from "../../components/RiyalSymbol/RiyalSymbol";
import { PackagePrice } from "./PackagePrice";

export const SinglePackage = ({ packageData }) => {
  const { i18n } = useTranslation("application", { keyPrefix: "products" });
  const currentLanguage = i18n.language;

  const packageName =
    currentLanguage === "ar" ? packageData.name_ar : packageData.name_en;
  const packageDescription =
    currentLanguage === "ar"
      ? packageData.description_ar
      : packageData.description_en;

  const [vatPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productCount] = useState(1);
  const [activeModificators, setActiveModificators] = useState([]);
  const [isError, setIsError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    packageData.cover_image_url
  );
  const [productsPrice, setProductsPrice] = useState(0);

  const moreThan1024 = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const totalProductPrice = calculateTotalPrice(
      packageData,
      productCount,
      activeModificators,
      vatPrice
    );
    setTotalPrice(parseFloat(totalProductPrice).toFixed(2));
  }, [productCount, activeModificators]);

  const imageStyles = {
    position: "absolute",
    zIndex: 10,
    top: 0,
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    paddingBottom: "1rem",
  };
  const vatincluded =
    parseFloat(packageData.list_price) + parseFloat(packageData.vat_price);

  const priceDifference = ((((productsPrice - vatincluded))/productsPrice) * 100).toFixed(2);

  useEffect(() => {
    const totalPackageProductPrice = _.sum(
      packageData.package_products.map((packageProduct) =>
        parseFloat(packageProduct.product.list_price) + parseFloat(packageProduct.product.vat_price)
      )
    );
    setProductsPrice(totalPackageProductPrice);
  }, [packageData]);

  return (
    <MainLayout fluid>
      <Helmet>
        <title>{packageName}</title>
        <meta name="description" content={packageDescription} />
      </Helmet>
      <Container
        fluid
        style={{
          paddingTop: "5%",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
        className="product-single-page"
      >
        <div style={{ position: "relative" }}>
          <Col
            sm={12}
            lg={5}
            style={moreThan1024 ? imageStyles : { paddingBottom: "10vmin" }}
          >
            <div className={`${moreThan1024 && "package-image-container"}`}>
              <div className="product-single">
                <div className="product-single__img-wrapper">
                  <ProductImage
                    source={selectedImage}
                    className="product-single__img"
                    alt="product"
                  />
                </div>
                {packageData.image_urls && packageData.image_urls.length > 0 && (
                  <div className="additional-images-slider">
                    {[
                      packageData.cover_image_url,
                      ...packageData.image_urls,
                    ].map((image) => (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions
                      <div
                        className={`additional-image-container ${
                          image === selectedImage ? "selected" : ""
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <ProductImage
                          source={image}
                          className="other-image"
                          alt="product"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>
          <div className="package-details-container">
            <Row>
              <Col sm={12} md={6} lg={3.5}>
                <div>
                  <Text type="headline2">{packageName}</Text>
                  <Text type="body2">{packageDescription}</Text>
                </div>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3.5}
                style={
                  moreThan1024
                    ? {
                        display: "flex",
                        flexDirection: "column",
                        marginInlineStart: "auto",
                      }
                    : null
                }
              >
                <div
                  className={`product-box ${
                    moreThan1024 && "product-box-sticky"
                  }`}
                >
                  {isError && <Alert type="danger">{isError}</Alert>}
                  <div>
                    <div className="price-box">
                      {vatincluded< productsPrice && (
                        <span className="package-old-price-cut text__rtl">
                          {productsPrice} <RiyalSymbol size={18} />
                        </span>
                      )}
                      {vatincluded < productsPrice && (
                        <span className="package-price-difference text__rtl">
                          {" "}
                          (
                          % {priceDifference}{" "}-)
                        </span>
                      )}
                    </div>
                    <PackagePrice
                      totalPrice={vatincluded}
                      quantity={productCount}
                      vatPrice={packageData?.list_price}
                    />
                  </div>
                  <hr className="line-space" />
                  <ModificatorsContainer
                    product={packageData}
                    activeModificators={activeModificators}
                    setActiveModificators={setActiveModificators}
                  />
                  <CartButtonContainer
                    packageData={packageData}
                    totalPrice={vatincluded}
                    productCount={productCount}
                    setError={setIsError}
                  />
                  <Vatinfo />
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <PackageProducts packageData={packageData} />
      </Container>
    </MainLayout>
  );
};
