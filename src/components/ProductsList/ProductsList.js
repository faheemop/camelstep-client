/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable immutable/no-mutation */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { productsApi } from "../../services/products";
import { ProductItem } from "../ProductItem/ProductItem";
import { NoSearchResultFound } from "../NoSearchResultFound/NoSearchResultFound";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  setParsedFilters,
  setAppliedFilters,
} from "../../features/products/productsSlice";
import "./ProductList.scss";
import { Container } from "../Layout/Container";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { NavigationButtons } from "./NavigationButtons/NavigationButtons";
import {
  getProductsBySection,
  getTagStatistics,
  getUncategorizedProducts,
} from "../../utils/product_filtering_utils";

const PRODUCTS_PER_PAGE = 16;

export const ProductsList = () => {
  const { t, i18n } = useTranslation("application");
  const { lang } = useParams();
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();

  const [page, setPage] = useLocalStorage("paginationCurrentPage", 1);
  const [currentPage, setCurrentPage] = useState(page);
  const appliedFilters = useSelector((state) => state.products.appliedFilters);
  const activeFilters = useSelector((state) => state.products.activeFilters);
  const mainCategory = useSelector((state) => state.products.mainCategory);

  const [isAppliedFiltersReady, setIsAppliedFiltersReady] = useState(false);
  const sectionRefs = useRef([]);

  const [firstPageProducts, setFirstPageProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [isFirstPageLoading, setIsFirstPageLoading] = useState(false);

  useEffect(() => {
    const fetchFirstPage = async () => {
      setIsFirstPageLoading(true);
      try {
        const result = await dispatch(
          productsApi.endpoints.getProducts.initiate({
            currentPage: 1,
            filterParams: appliedFilters,
            lang: i18n.language,
          })
        ).unwrap();

        if (result?.records) {
          setFirstPageProducts(result.records);
        } else {
          setFirstPageProducts([]);
        }
      } catch (err) {
        console.error("Error fetching first page:", err);
        setFirstPageProducts([]);
      } finally {
        setIsFirstPageLoading(false);
      }
    };

    if (isAppliedFiltersReady) {
      fetchFirstPage();
    }
  }, [appliedFilters, i18n.language, isAppliedFiltersReady, dispatch]);

  useEffect(() => {
    const fetchAllPages = async () => {
      if (!isAppliedFiltersReady || firstPageProducts.length === 0) return;
      setIsFetchingAll(true);

      let page = 2;
      let merged = [...firstPageProducts];
      let hasMore = true;

      while (hasMore) {
        try {
          const result = await dispatch(
            productsApi.endpoints.getProducts.initiate({
              currentPage: page,
              filterParams: appliedFilters,
              lang: i18n.language,
            })
          ).unwrap();

          if (result?.records?.length > 0) {
            merged = [...merged, ...result.records];
            page++;
            hasMore = result.records.length === PRODUCTS_PER_PAGE;
          } else {
            hasMore = false;
          }
        } catch (err) {
          console.error("Error fetching page:", page, err);
          hasMore = false;
        }
      }

      setAllProducts(merged);
      setIsFetchingAll(false);
    };

    fetchAllPages();
  }, [appliedFilters, i18n.language, isAppliedFiltersReady, firstPageProducts]);

  useEffect(() => {
    setFirstPageProducts([]);
    setAllProducts([]);
  }, [i18n.language, appliedFilters]);

  const parseActiveFilters = (filters, category) => {
    const allFilters = [];
    Object.keys(filters).forEach((filter) => {
      if (filters[filter].length !== 0) {
        if (filter === "searchPhrase") {
          allFilters.push({ name: "filters[q]", value: filters[filter] });
          return;
        }
        allFilters.push(...filters[filter]);
      }
    });
    if (mainCategory === "Coffee") {
      allFilters.push({ name: "filters[grouping]", value: "coffee" });
    } else if (category === "Tools") {
      allFilters.push({ name: "filters[grouping]", value: "equipment" });
    } else if (category === "Archive") {
      allFilters.push({ name: "filters[archived]", value: true });
    } else if (category === "SpareParts") {
      allFilters.push({ name: "filters[grouping]", value: "spare_part" });
    }
    return allFilters;
  };

  useEffect(() => {
    const parsedFilters = parseActiveFilters(activeFilters, mainCategory);
    dispatch(setAppliedFilters([...parsedFilters]));
    setIsAppliedFiltersReady(true);
  }, [activeFilters, mainCategory]);

  const sectionConfig = useMemo(() => {
    const translations = {
      bestseller: t("sections.bestseller"),
      new: t("sections.new"),
      exclusive: t("sections.exclusive"),
      limited: t("sections.limited"),
    };

    return {
      bestseller: {
        title: translations.bestseller,
        tagKey: "bestseller",
        priority: 1,
      },
      new: { title: translations.new, tagKey: "new", priority: 2 },
      exclusive: {
        title: translations.exclusive,
        tagKey: "exclusive",
        priority: 3,
      },
      limited: { title: translations.limited, tagKey: "limited", priority: 4 },
    };
  }, [i18n.language]);

  const sectionsData = useMemo(() => {
    const productsToUse =
      allProducts.length > 0 ? allProducts : firstPageProducts;

    if (!productsToUse || productsToUse.length === 0) {
      return { sections: [], uncategorizedProducts: [], tagStats: {} };
    }

    const sections = getProductsBySection(productsToUse, sectionConfig);
    const usedTagKeys = Object.values(sectionConfig).map(
      (config) => config.tagKey
    );
    const uncategorizedProducts = getUncategorizedProducts(
      productsToUse,
      usedTagKeys
    );
    const tagStats = getTagStatistics(productsToUse);

    return { sections, uncategorizedProducts, tagStats };
  }, [allProducts, firstPageProducts, sectionConfig]);

  // ✅ Scroll handler
  const handleScroll = (index, direction) => {
    const container = sectionRefs.current[index];
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ✅ Render section
  const renderProductSection = (section, index) => (
    <section key={section.key} className="product-section">
      <div className="heading-section">
        <h2 className="section-heading">{section.title}</h2>
        <NavigationButtons
          onLeftClick={() => handleScroll(index, "left")}
          onRightClick={() => handleScroll(index, "right")}
          isRTL={isRTL}
        />
      </div>
      <div
        className="horizontal-container"
        ref={(el) => (sectionRefs.current[index] = el)}
      >
        {section.products.map((product) => (
          <div className="horizontal-item" key={product.id}>
            <ProductItem
              key={`${i18n.language}-${section.key}-${product.id}`}
              product={product}
            />
          </div>
        ))}
      </div>
    </section>
  );

  // ✅ Main return function
  const returnProducts = () => {
    if (isFirstPageLoading) {
      return (
        <Container className="single-product-container">
          <LoadingSpinner />
        </Container>
      );
    }

    if (!isFirstPageLoading && firstPageProducts.length === 0) {
      return (
        <Container className="single-product-container">
          <NoSearchResultFound />
        </Container>
      );
    }

    const { sections, uncategorizedProducts } = sectionsData;
    let sectionIndex = 0;

    if (sections.length === 0 && uncategorizedProducts.length === 0) {
      return (
        <div className="product-sections">
          <section className="product-section">
            <div className="heading-section">
              <h2 className="section-heading">
                All Products ({firstPageProducts.length})
              </h2>
              <NavigationButtons
                onLeftClick={() => handleScroll(0, "left")}
                onRightClick={() => handleScroll(0, "right")}
              />
            </div>
            <div
              className="horizontal-container"
              ref={(el) => (sectionRefs.current[0] = el)}
            >
              {firstPageProducts.map((product) => (
                <div className="horizontal-item" key={product.id}>
                  <ProductItem
                    key={`${i18n.language}-all-${product.id}`}
                    product={product}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="product-sections">
        {sections.map((section) => {
          const renderedSection = renderProductSection(section, sectionIndex);
          sectionIndex++;
          return renderedSection;
        })}
        {uncategorizedProducts.length > 0 &&
          renderProductSection(
            {
              key: "uncategorized",
              title: t("sections.others"),
              products: uncategorizedProducts,
            },
            sectionIndex
          )}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={currentPage}>{returnProducts()}</motion.div>
      </AnimatePresence>
    </>
  );
};
