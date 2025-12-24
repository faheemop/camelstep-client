// src/components/SearchModal/SearchModal.js

import React, { useEffect, useState } from "react";
import "./SearchModal.scss";
import { Navbar } from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { resetFilters, setFilter } from "../../features/products/productsSlice";
import { useTranslation } from "react-i18next";

// ✅ API hooks
import { useGetBrewingMethodsQuery } from "../../services/brewingMethods";
import {
  useGetProductFiltersQuery,
  useGetToolsCategoryQuery,
} from "../../services/products";
import { major_notes, noneValue } from "../../pages/ProductsPage/filtersData";
import { useGetBrandsQuery } from "../../services/brands";

export const SearchModal = ({ onClose }) => {
  const { t, i18n } = useTranslation("application");
  const dispatch = useDispatch();
  const { mainCategory } = useSelector((state) => state.products);
  const activeFilters = useSelector((state) => state.products.activeFilters);

  // ✅ API data
  const { data: brewingMethodFiltersData, isLoading: brewingLoading } =
    useGetBrewingMethodsQuery();
  const { data: productsFiltersData, isLoading: productsLoading } =
    useGetProductFiltersQuery();
  const { data: toolCategoryFiltersData, isLoading: categoryLoading } =
    useGetToolsCategoryQuery();
  const { data: brandsFiltersData, isLoading: brandsLoading } =
    useGetBrandsQuery();

  // ✅ States
  const [countries, setCountries] = useState([]);
  const [brewingMethods, setBrewingMethods] = useState([]);
  const [notes, setNotes] = useState([]);
  const [toolCategoriesFilters, setToolCategoriesFilters] = useState([]);
  const [trademarks, setTrademarks] = useState([]);

  const [activeTab, setActiveTab] = useState(
    mainCategory === "Coffee" ? "method" : "trademark"
  );
  const [selected, setSelected] = useState({});

  // ✅ Translation helper
  const getTranslatedName = (translationName) => {
    if (!translationName) return "";
    return translationName[i18n.language] || translationName["en"] || "";
  };

  // ✅ Brewing Methods API
  useEffect(() => {
    if (brewingMethodFiltersData) {
      setBrewingMethods(
        brewingMethodFiltersData.map((el) => ({
          id: el.id,
          translationName: { en: el.name, ar: el.name_ar },
          translationShort: {
            en: el.short_description,
            ar: el.short_description_ar,
          },
          filterParams: [{ name: "filters[brewing_method_id]", value: el.id }],
        }))
      );
    }
  }, [brewingMethodFiltersData]);

  // ✅ Countries + Notes API
  useEffect(() => {
    if (productsFiltersData) {
      setCountries(
        (productsFiltersData?.countries || []).map((c) => ({
          id: c.value,
          translationName: { en: c.name_en, ar: c.name_ar },
          filterParams: [{ name: "filters[country_id]", value: c.value }],
        }))
      );

      // major_notes already structured hai
      setNotes(major_notes);
    }
  }, [productsFiltersData]);

  // ✅ Tool categories API
  useEffect(() => {
    if (toolCategoryFiltersData) {
      const categoryFiltersMap = [
        ...toolCategoryFiltersData.records.map((el) => ({
          id: el.id,
          translationName: { en: el.name, ar: el.name_ar },
          filterParams: [{ name: "filters[category_id]", value: el.id }],
        })),
      ];
      setToolCategoriesFilters(categoryFiltersMap);
    }
  }, [toolCategoryFiltersData]);

  // ✅ Trademark (brands) filters
  useEffect(() => {
    if (brandsFiltersData) {
      const trademarksMap = [
        ...brandsFiltersData.map((el) => ({
          id: el.id,
          translationName: { en: el.name, ar: el.name_ar },
          filterParams: [{ name: "filters[brand_id]", value: el.id }],
        })),
      ];
      setTrademarks(trademarksMap);
    }
  }, [brandsFiltersData]);
  // ✅ Initialize selected state from Redux
  useEffect(() => {
    const initialSelected = {};
    if (activeFilters.method) {
      initialSelected.method = brewingMethods?.find(
        (m) => m?.id === activeFilters.method?.[0]?.value
      );
    }
    if (activeFilters.country) {
      initialSelected.country = countries.find(
        (c) => c.id === activeFilters.country?.[0]?.value
      );
    }
    if (activeFilters.note) {
      initialSelected.note = notes.find(
        (n) => n.value === activeFilters.note?.[0]?.value
      );
    }
    if (activeFilters.category) {
      initialSelected.category = toolCategoriesFilters.find(
        (n) => n.id === activeFilters.category?.[0]?.value
      );
    }
    if (activeFilters.trademark) {
      initialSelected.trademark = trademarks.find(
        (n) => n.id === activeFilters.trademark?.[0]?.value
      );
    }
    // You can add category logic here if needed
    setSelected(initialSelected);
  }, [activeFilters, brewingMethods, countries, notes, toolCategoriesFilters]);

  // ✅ Panel options
  const getPanelOptions = () => {
    if (activeTab === "country") return countries;
    if (activeTab === "method") return brewingMethods;
    if (activeTab === "note") return notes;
    if (activeTab === "category") return toolCategoriesFilters;
    if (activeTab === "trademark") return trademarks;
    return [];
  };

  // ✅ External handler
  const externalHandler = (option, source) => {
    option.filterParams?.forEach(() =>
      dispatch(setFilter({ key: source, value: option.filterParams }))
    );
  };

  // ❌ Packages ke liye modal render mat karo
  if (mainCategory === "Packages" || mainCategory === "الباقات") {
    return null;
  }

  // ✅ Tabs dynamic
  const tabs =
    mainCategory === "Coffee"
      ? [
          {
            id: "method",
            title: t("common.brewingMethodModal"),
            inactive: t("common.brewingMethod"),
            description: t("common.descbrew"),
          },
          {
            id: "country",
            title: t("common.countryModal"),
            inactive: t("common.country"),
            description: t("common.descCountry"),
          },
          {
            id: "note",
            title: t("common.majorNotedModal"),
            inactive: t("common.majorNote"),
            description: t("common.descMajor"),
          },
        ]
      : mainCategory === "Tools"
      ? [
          {
            id: "trademark",
            title: t("common.trademark"),
            inactive: t("common.selectTrademark"),
            description: t("common.descTrademark"),
          },
          {
            id: "category",
            title: t("common.category"),
            inactive: t("common.catModal"),
            description: t("common.descTool"),
          },
        ]
      : [];

  return (
    <div className="accordion-modal">
      <Navbar showSearchBar />
      <button className="close-btn" onClick={onClose}>
        X
      </button>

      <div className="tabs-wrapper">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              className={`tab-panel ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-title">
                <span>{tab.inactive}</span>
                {!isActive && (
                  <span className="inactive-label">{tab.title}</span>
                )}
              </div>

              {isActive && (
                <>
                  <div className="tab-description">{tab.description}</div>
                  <div className="tab-content">
                    {(brewingLoading ||
                      productsLoading ||
                      categoryLoading ||
                      brandsLoading) && <p className="loading">Loading...</p>}

                    {!brewingLoading &&
                      !productsLoading &&
                      !categoryLoading &&
                      getPanelOptions().map((item) => {
                        const displayName = getTranslatedName(
                          item.translationName
                        );

                        return (
                          <label key={item.id} className="radio-item">
                            <input
                              type="radio"
                              name={activeTab}
                              value={displayName}
                              checked={selected[activeTab]?.id === item.id}
                              onChange={() =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [activeTab]: item,
                                }))
                              }
                            />
                            <div className="radio-text-group">
                              <span className="radio-label">{displayName}</span>
                              {item.translationShort && (
                                <small className="radio-desc">
                                  {item.translationShort?.[i18n.language] ||
                                    item.translationShort?.en}
                                </small>
                              )}
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <footer className="modal-footer">
        <button
          className="reset-btn"
          onClick={() => {
            dispatch(resetFilters());
            setSelected({});
          }}
        >
          {t("common.reset")}
        </button>
        <button
          className="apply-btn"
          onClick={() => {
            Object.keys(selected).forEach((key) => {
              if (selected[key]) {
                externalHandler(selected[key], key);
              }
            });
            onClose();
          }}
        >
          {t("common.apply")}
        </button>
      </footer>
    </div>
  );
};
