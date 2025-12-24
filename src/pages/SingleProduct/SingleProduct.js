import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Container, Row, Col } from "react-grid-system";
import {
  useGetProductAvailableVariantsQuery,
  useGetSimilarProductsQuery,
  useLazyGetProductRecipeQuery,
  useLazyGetProductVariantQuery,
} from "../../services/products";
import { Text } from "../../components/Text/Text";
import { MainLayout } from "../../components/Layout/MainLayout";
import { useMediaQuery } from "../../hooks/useCurrentScreenWidth";
import { ProductDetailsSection } from "./ProductDetailsSection";
import { NeededProductsSection } from "./NeededProductsSection";
import { SimilarProducts } from "./SimilarProducts";
import { ProductImageContainer } from "./ProductImageContainer";
import { RecommendedBrewingMethod } from "./RecommendedBrewingMethod";
import {
  calculateTotalPrice,
  getInStockQuantity,
} from "../../helpers/productHelpers";
import { ProductPrice } from "./ProductPrice";
import { ModificatorsContainer } from "./ModificatorsContainer";
import { QuantityInput } from "../../components/common/QuantityInput/QuantityInput";
import { CartButtonContainer } from "./CartButtonContainer";
import { Alert } from "../../components/common/Alert/Alert";
import BeansIcon from "../../assets/icons/beans-icon.svg";
import { isBlank } from "../../helpers/textHelpers";
import { ProductVariants } from "./ProductVariants";
import { Vatinfo } from "../../components/VatInfo/Vatinfo";

import "./SingleProduct.scss";
import { ProductAttachments } from "../../components/specs/specs";

export const SingleProduct = ({ product }) => {
  console.log("data", product);
  const productId = product?.id;
  // console.log("productId", typeof productId);
  const { t, i18n } = useTranslation("application");

  const [trigger, { result: brewMethodData }] = useLazyGetProductRecipeQuery();
  const { data: similarProductsData = [] } =
    useGetSimilarProductsQuery(productId);
  const [getProductVariant] = useLazyGetProductVariantQuery();
  const { data: productVariantsData } =
    useGetProductAvailableVariantsQuery(productId);
  const [stockAmount, setStockAmount] = useState(0);
  const [customProperties, setCustomProperties] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [brewSteps, setBrewSteps] = useState([]);
  const [neededProducts, setNeededProducts] = useState([]);
  const [variantValues, setVariantValues] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const hasProductDetails = productDetails.length > 0;

  useEffect(() => {
    if (productVariantsData && productVariantsData.length > 0) {
      const initialVariantsState = productVariantsData.reduce(
        (acc, current) => [
          ...acc,
          {
            variantId: current.id,
            variantName: current.name,
            variantValueId: "none",
          },
        ],
        []
      );
      setVariantValues(initialVariantsState);
    } else {
      setVariantValues([]);
    }
  }, [productVariantsData]);

  const [vatPrice, setVatPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productCount, setProductCount] = useState(1);
  const [activeModificators, setActiveModificators] = useState([]);
  const [isError, setIsError] = useState(null);

  const [productImages, setProductImages] = useState([]);

  const moreThan1024 = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setCustomProperties(product.custom_properties);
    setVatPrice(product.vat_price);
    setTotalPrice(
      (parseFloat(product.list_price) + parseFloat(product.vat_price)).toFixed(
        2
      )
    );

    trigger(productId).then((result) => {
      // const { data: { steps, recommended_products } } = result;
      const steps = result?.data?.steps || [];
      const recommended_products = result?.data?.recommended_products || [];

      setBrewSteps(steps);

      const allNeededProducts = steps.reduce(
        (accumulator, currentStep) => [...accumulator, ...currentStep.products],
        recommended_products
      );

      const uniqueProducts = allNeededProducts.filter(
        (element, index, array) => array.indexOf(element) === index
      );

      setNeededProducts(uniqueProducts);
    });

    const tempProductDetails = [];
    const { country, flavours } = product;

    if (!isBlank(country?.name)) {
      tempProductDetails.push({
        name: t("common.country"),
        value: country.name,
      });
    }
    if (flavours.length > 0) {
      const mappedFlavours = flavours.reduce(
        (accumulatr, flavour) => ({
          major_note: [...accumulatr.major_note, flavour.major_note],
          minor_note: [...accumulatr.minor_note, flavour.minor_note],
          taste: [...accumulatr.taste, flavour.taste],
        }),
        {
          major_note: [],
          minor_note: [],
          taste: [],
        }
      );

      const flavourNamesMap = {
        major_note: "majorNote",
        minor_note: "minorNote",
        taste: "taste",
      };

      Object.keys(mappedFlavours).forEach((flavourKey) => {
        tempProductDetails.push({
          name: t(`common.${flavourNamesMap[flavourKey]}`),
          value: mappedFlavours[flavourKey],
        });
      });
    }
    setProductDetails([...tempProductDetails]);
  }, [i18n.language]);

  useEffect(() => {
    const totalProductPrice = calculateTotalPrice(
      product,
      productCount,
      activeModificators,
      vatPrice
    );
    setTotalPrice(parseFloat(totalProductPrice).toFixed(2));
  }, [productCount, activeModificators]);

  useEffect(() => {
    if (variantValues.length > 0) {
      const isEveryVariantSelected = variantValues.every(
        (variant) => variant.variantValueId !== "none"
      );
      if (isEveryVariantSelected) {
        const selectedVariantsIds = variantValues
          .filter((variant) => variant.variantValueId !== "none")
          .map((variant) => variant.variantValueId);
        getProductVariant({
          id: productId,
          variantValuesIds: selectedVariantsIds,
        })
          .then((result) => {
            const { data: resultData, error } = result;
            setStockAmount(resultData.quantity);
            setProductCount(1);
            if (
              resultData?.main_image_url &&
              resultData?.additional_image_urls
            ) {
              setProductImages([
                resultData.main_image_url,
                ...resultData.additional_image_urls,
              ]);
            }
            if (error) {
              throw error;
            }
          })
          .catch(() => {
            setProductImages([
              product.image_url,
              ...product.additional_image_urls,
            ]);
          });
      } else {
        setStockAmount(null);
        setProductImages([product.image_url, ...product.additional_image_urls]);
      }
    } else {
      setProductImages([product.image_url, ...product.additional_image_urls]);
    }
  }, [variantValues, product]);

  useEffect(() => {
    if (
      productVariantsData &&
      productVariantsData.length > 0 &&
      product.quantity_available > 0
    ) {
      setStockAmount(null);
      setIsButtonDisabled(false);
    } else {
      setStockAmount(product.quantity_available);

      const isPurchasable =
        product.quantity_available > 0 && product.is_purchasable;
      setIsButtonDisabled(!isPurchasable);
    }
  }, [productVariantsData]);

  const currentLanguage = i18n.language;
  const seoTitle =
    currentLanguage === "en" ? product?.seo_title : product?.seo_title_ar;
  const seoDescription =
    currentLanguage === "en"
      ? product?.seo_description
      : product?.seo_description_ar;

  return (
    <MainLayout fluid>
      <Helmet>
        <title>{seoTitle || product.name}</title>
        <meta
          name="description"
          content={seoDescription || product.description}
        />
        <meta name="keywords" content={product.seo_keywords} />
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
            style={
              moreThan1024
                ? {
                    position: "absolute",
                    zIndex: 10,
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    paddingBottom: "1rem",
                  }
                : { paddingBottom: "10vmin" }
            }
          >
            <div
              style={moreThan1024 ? { position: "sticky", top: "100px" } : null}
            >
              <ProductImageContainer product={product} images={productImages} />
            </div>
          </Col>
          <div style={{ position: "relative", paddingBlockEnd: "10vmin" }}>
            <Row>
              <Col
                sm={12}
                md={6}
                lg={3.5}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div>
                  <Text type="headline2">{product.name}</Text>
                  <Text type="body2">{product.description}</Text>
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
                  style={
                    moreThan1024 ? { position: "sticky", top: "90px" } : null
                  }
                  className="product-box"
                >
                  {isError && <Alert type="danger">{isError}</Alert>}
                  <ProductPrice
                    totalPrice={totalPrice}
                    quantity={productCount}
                    vatPrice={vatPrice}
                  />
                  <hr style={{ margin: "2rem 0" }} />
                  <ProductVariants
                    variantValue={variantValues}
                    setVariantValue={setVariantValues}
                    variantsData={productVariantsData}
                  />
                  <ModificatorsContainer
                    product={product}
                    activeModificators={activeModificators}
                    setActiveModificators={setActiveModificators}
                  />
                  <QuantityInput
                    initialValue={productCount}
                    onQuantityChange={setProductCount}
                    maxQuantity={getInStockQuantity(stockAmount)}
                    disabled={getInStockQuantity(stockAmount) === 0}
                  />
                  <CartButtonContainer
                    product={product}
                    totalPrice={totalPrice}
                    productCount={productCount}
                    activeModificators={activeModificators}
                    variantValues={variantValues}
                    setError={setIsError}
                    isButtonDisabled={isButtonDisabled}
                  />
                  {product.grouping === "coffee" && (
                    <div className="product-box__info">
                      <BeansIcon />
                      <Text type="body2">
                        {t("products.product.beansInfo")}
                      </Text>
                    </div>
                  )}
                  <Vatinfo />
                  <ProductAttachments attachments={product.attachments} />
                </div>
              </Col>
            </Row>
            <ProductDetailsSection
              productDetails={productDetails}
              customProperties={customProperties}
            />
          </div>
          {brewSteps.length > 0 && (
            <RecommendedBrewingMethod
              brewSteps={brewSteps}
              brewMethod={brewMethodData}
              productId={productId}
              hasProductDetails={hasProductDetails}
            />
          )}
        </div>
        <NeededProductsSection neededProducts={neededProducts} />
        <SimilarProducts similarProducts={similarProductsData} />
      </Container>
    </MainLayout>
  );
};
