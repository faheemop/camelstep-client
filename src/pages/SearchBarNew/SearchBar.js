/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/icons/SearchWhite.png";
import "./SearchBarWithFilters.scss";
import { useGetBrewingMethodsQuery } from "../../services/brewingMethods";
import {
  useGetProductFiltersQuery,
  useGetToolsCategoryQuery,
} from "../../services/products";
import { major_notes, noneValue } from "../ProductsPage/filtersData";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  resetBrewing,
  resetCountry,
  resetFilters,
  resetNote,
  setFilter,
  setFilterValues,
  setSearchPackage,
  setTaste,
} from "../../features/products/productsSlice";
import { debounce } from "lodash";
import { useGetBrandsQuery } from "../../services/brands";

export const SearchBarWithFilters = () => {
  const { t, i18n } = useTranslation("application");
  const dispatch = useDispatch();

  const { data: brewingMethodFiltersData } = useGetBrewingMethodsQuery();
  const { data: brandsFiltersData } = useGetBrandsQuery();
  console.log("brands", brandsFiltersData);
  const { data: productsFiltersData } = useGetProductFiltersQuery();
  const { data: toolCategoryFiltersData } = useGetToolsCategoryQuery();

  const { mainCategory } = useSelector((state) => state.products);

  // ✅ States
  const [toolCategoriesFilters, setToolCategoriesFilters] = useState([]);
  const [filtersDataReady, setFiltersDataReady] = useState(false);
  const [countries, setCountries] = useState([]);
  const [brewingMethods, setBrewingMethods] = useState([]);
  const [trademarks, setTrademarks] = useState([]);

  const [activeTab, setActiveTab] = useState(null);
  const [selected, setSelected] = useState({
    country: null,
    brewing: null,
    note: null,
    category: null,
    trademark: null,
  });
  const panelRef = useRef(null);

  // ✅ Translation fallback helper
  const getTranslatedName = (translationName) => {
    if (!translationName) return "";
    return translationName[i18n.language] || translationName["en"] || "";
  };

  // ✅ Brewing methods.
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

  // ✅ Category filters
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

  // ✅ Country filters
  useEffect(() => {
    if (productsFiltersData) {
      const countries = productsFiltersData?.countries.map((el) => ({
        id: el.value,
        translationName: {
          en: el.name_en,
          ar: el.name_ar,
        },
        filterParams: [
          {
            name: "filters[country_id]",
            value: el.value,
          },
        ],
      }));
      setCountries(countries);
    }
  }, [productsFiltersData]);

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

  // ✅ Ready check
  useEffect(() => {
    if (productsFiltersData && brewingMethodFiltersData) {
      setFiltersDataReady(true);
    }
  }, [productsFiltersData, brewingMethodFiltersData]);

  // ✅ External handler
  const externalHandler = (option, source) => {
    dispatch(
      setFilter({
        key: source,
        value: option.filterParams,
      })
    );
  };

  // ✅ Set filter value
  const setFilterValue = (value, option) => {
    const name =
      activeTab === "note"
        ? "taste"
        : activeTab === "brewing"
        ? "brewing_method"
        : activeTab === "category"
        ? "category"
        : "country";

    if (activeTab === "note") {
      dispatch(
        setTaste({
          majorNote: {
            name: option.name,
            translationName: option.translationName,
          },
        })
      );
    } else {
      dispatch(setFilterValues({ [name]: value }));
    }
  };

  // ✅ Option click
  const handleOptionClick = (e, key, option) => {
    externalHandler(option, key);
    setFilterValue(option.id, option);

    setSelected((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  const handleSelect = (key, option, e) => {
    handleOptionClick(e, key, option);
  };

  // ✅ Search input
  const handleSearch = debounce((ev) => {
    if (mainCategory == "Packages") {
      dispatch(setSearchPackage(ev.target.value));
    } else {
      const obj = { key: "searchPhrase", value: ev.target.value };
      dispatch(setFilter(obj));
      const productsListElement = document.getElementById("products-list");
      if (productsListElement) {
        productsListElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, 500);

  // ✅ Panel options
  const getPanelOptions = () => {
    if (activeTab === "country") return countries;
    if (activeTab === "brewing") return brewingMethods;
    if (activeTab === "note") return major_notes;
    if (activeTab === "category") return toolCategoriesFilters;
    if (activeTab === "trademark") return trademarks;
    return [];
  };

  // ✅ Reset filter
  const handleResetFilter = (filterType) => {
    if (filterType === "brewing") {
      setSelected((prev) => ({ ...prev, brewing: null }));
      dispatch(resetBrewing());
    } else if (filterType === "country") {
      setSelected((prev) => ({ ...prev, country: null }));
      dispatch(resetCountry());
    } else if (filterType === "note") {
      setSelected((prev) => ({ ...prev, note: null }));
      dispatch(resetNote());
    } else if (filterType === "category") {
      setSelected((prev) => ({ ...prev, category: null }));
      dispatch(resetFilters());
    } else if (filterType === "trademark") {
      setSelected((prev) => ({ ...prev, trademark: null }));
      dispatch(resetFilters()); // or custom resetBrand() if you have one
    }
  };

  useEffect(() => {
    setActiveTab(null);
  }, [mainCategory]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActiveTab(null);
      }
    }
    if (activeTab) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTab]);

  return (
    <div className="search-bar-with-filters">
      <div className="search-filters-container">
        <div
          className={`search-bar-desk ${activeTab ? "bg-gray" : "bg-white"}`}
        >
          <div className="custom-search">
            <input
              type="search"
              placeholder={t("filtering.search")}
              customWrapperClass="search-input"
              onChange={(ev) => handleSearch(ev)}
            />
          </div>

          {mainCategory === "Coffee" && (
            <>
              {/* Brewing */}
              <div
                className={`input-group ${
                  activeTab === "brewing" && "clicked-filter"
                }`}
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                onClick={() =>
                  setActiveTab(activeTab === "brewing" ? null : "brewing")
                }
              >
                <label>{t("common.brewingMethod")}</label>
                <input
                  value={
                    selected.brewing
                      ? getTranslatedName(selected.brewing.translationName)
                      : t("common.selectMethod")
                  }
                  readOnly
                />
                {selected.brewing && (
                  <span
                    className={`clear-filter-icon ${
                      i18n.language === "ar" ? "rtl" : "ltr"
                    }`}
                    onClick={() => handleResetFilter("brewing")}
                  >
                    ✕
                  </span>
                )}
              </div>

              {/* Country */}
              <div
                className={`input-group ${
                  activeTab === "country" && "clicked-filter"
                }`}
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                onClick={() =>
                  setActiveTab(activeTab === "country" ? null : "country")
                }
              >
                <label>{t("common.country")}</label>
                <input
                  value={
                    selected.country
                      ? getTranslatedName(selected.country.translationName)
                      : t("common.selectCountry")
                  }
                  readOnly
                />
                {selected.country && (
                  <span
                    className="clear-filter-icon"
                    onClick={() => handleResetFilter("country")}
                  >
                    ✕
                  </span>
                )}
              </div>

              {/* Note */}
              <div
                className={`input-group no-border ${
                  activeTab === "note" && "clicked-filter"
                }`}
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                style={{
                  borderLeft: `${activeTab ? "0px" : "1px solid #ddd"}`,
                }}
                onClick={() =>
                  setActiveTab(activeTab === "note" ? null : "note")
                }
              >
                <label>{t("common.majorNote")}</label>
                <input
                  value={
                    selected.note
                      ? getTranslatedName(selected.note.translationName)
                      : t("common.selectNote")
                  }
                  readOnly
                />
                {selected.note && (
                  <span
                    className="clear-filter-icon"
                    onClick={() => handleResetFilter("note")}
                  >
                    ✕
                  </span>
                )}
              </div>
            </>
          )}

          {mainCategory === "Tools" && (
            <>
              {/* Trademark */}
              <div
                className={`input-group ${
                  activeTab === "trademark" && "clicked-filter"
                }`}
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                onClick={() =>
                  setActiveTab(activeTab === "trademark" ? null : "trademark")
                }
              >
                <label>{t("common.trademark").toUpperCase()}</label>
                <input
                  value={
                    selected.trademark
                      ? getTranslatedName(selected.trademark.translationName)
                      : t("common.selectTrademark")
                  }
                  readOnly
                />
                {selected.trademark && (
                  <span
                    className="clear-filter-icon"
                    onClick={() => handleResetFilter("trademark")}
                  >
                    ✕
                  </span>
                )}
              </div>

              <div
                className={`input-group no-border ${
                  activeTab === "category" && "clicked-filter"
                }`}
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                style={{
                  borderLeft: `${activeTab ? "0px" : "1px solid #ddd"}`,
                }}
                onClick={() =>
                  setActiveTab(activeTab === "category" ? null : "category")
                }
              >
                {" "}
                <label>{t("common.category").toUpperCase()}</label>
                <input
                  value={
                    selected.category
                      ? getTranslatedName(selected.category.translationName)
                      : t("common.selectCate")
                  }
                  readOnly
                />
                {selected.category && (
                  <span
                    className="clear-filter-icon"
                    onClick={() => handleResetFilter("category")}
                  >
                    ✕
                  </span>
                )}
              </div>
            </>
          )}

          <div className="icon-wrapper">
            <img src={SearchIcon} alt="Search" className="search-icon" />
          </div>
        </div>
      </div>

      {activeTab && (
        <div className="tab-panel active" ref={panelRef}>
          <div className="tab-title">
            <span className="inactive-label">
              {activeTab === "brewing" && t("common.selectMethod")}
              {activeTab === "country" && t("common.selectCountry")}
              {activeTab === "note" && t("common.selectNote")}
              {activeTab === "category" && t("common.selectCate")}
              {activeTab === "trademark" && t("common.selectTrademark")}
            </span>
          </div>

          <div className="tab-content">
            {getPanelOptions()?.map((item) => {
              const displayName = getTranslatedName(item.translationName);

              return (
                <label key={item.id} className="radio-item">
                  <input
                    type="radio"
                    name={activeTab}
                    value={displayName}
                    checked={
                      selected[activeTab]?.id &&
                      selected[activeTab]?.id === item.id
                    }
                    readOnly
                    onClick={(e) => handleSelect(activeTab, item, e)}
                  />
                  <div className="radio-text-group">
                    <span className="radio-label">{displayName}</span>
                    {item.translationShort && (
                      <small className="radio-desc">
                        {item.translationShort?.[i18n.language] ||
                          item.translationShort?.en ||
                          ""}
                      </small>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
