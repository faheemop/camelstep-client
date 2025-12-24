import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CustomSelect } from "../../../components/inputs/CustomSelect/CustomSelect";
import {
  setFilter,
  setFilterValues,
} from "../../../features/products/productsSlice";
import { useGetToolsCategoryQuery } from "../../../services/products";
import { noneValue } from "../filtersData";
import "./ToolsFilters.scss";

export const ToolsFilters = () => {
  const { t } = useTranslation("application");
  const dispatch = useDispatch();
  const { data: toolCategoryFiltersData } = useGetToolsCategoryQuery();
  const [toolCategoriesFilters, setToolCategoriesFilters] = useState([]);
  const filterValues = useSelector((state) => state.products.filterValues);

  useEffect(() => {
    if (toolCategoryFiltersData) {
      const categoryFiltersMap = [
        // noneValue,
        ...toolCategoryFiltersData.records.map((el) => ({
          id: el.id,
          name: el.name,
          translationName: {
            en: el.name,
            ar: el.name_ar,
          },
          value: el.name,
          filterParams: [
            {
              name: "filters[category_id]",
              value: el.id,
            },
          ],
        })),
      ];
      setToolCategoriesFilters(categoryFiltersMap);
    }
  }, [toolCategoryFiltersData]);

  const setFilterValue = (value, el) => {
    const { name } = el;
    dispatch(setFilterValues({ [name]: value }));
  };

  const externalHandler = (option, source) => {
    const urlParams = new URLSearchParams();
    option.filterParams.forEach((param) =>
      urlParams.append(param.name, param.value)
    );

    dispatch(
      setFilter({
        key: source,
        value: option.filterParams,
      })
    );
  };

  return (
    <div className="tools-filters-container">
      <CustomSelect
        label={t("common.categories").toLocaleUpperCase()}
        inputName="tool_category"
        value={filterValues.tool_category}
        options={toolCategoriesFilters}
        setValue={setFilterValue}
        externalHandler={externalHandler}
        tagFilterSelect
      />
    </div>
  );
};
