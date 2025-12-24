import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimatePresence, motion } from "framer-motion";
import { useGetPackagesQuery } from "../../services/products";
import { Pagination } from "../Pagination/Pagination";
import { PackageItem } from "../PackageItem/PackageItem";
import { NoSearchResultFound } from "../NoSearchResultFound/NoSearchResultFound";
import { useLocalStorage } from "../../hooks/useLocalStorage";

import "./PackagesList.scss";
import { useSelector } from "react-redux";

const PRODUCTS_PER_PAGE = 16;

export const PackagesList = () => {
  const { t, i18n } = useTranslation("application");
  const [page, setPage] = useLocalStorage("paginationCurrentPage", 1);
  const [currentPage, setCurrentPage] = useState(page);

  const { searchPackage } = useSelector((state) => state.products);

  const { data, isLoading } = useGetPackagesQuery({ currentPage, searchPackage });
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setCurrentProducts(data.records);

    if (data.records / PRODUCTS_PER_PAGE < currentPage) {
      setCurrentPage(1);
    }
  }, [data]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const returnProducts = () => {
    if (isLoading) {
      return <div>{t("common.loading")}</div>;
    }
    if (currentProducts.length === 0) {
      return <NoSearchResultFound />;
    }
    return (
      <div className="horizontal-container1">
        {currentProducts.map((product) => (
          <div
            className="horizontal-item"
            key={`${i18n.language}-${product.id}`}
          >
            <PackageItem product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        <motion.div key={currentPage}>{returnProducts()}</motion.div>
      </AnimatePresence>

      {currentProducts.length !== 0 && (
        <Pagination
          postsPerPage={PRODUCTS_PER_PAGE}
          totalPosts={data?.total_count || 1}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </>
  );
};
