import { createSlice } from "@reduxjs/toolkit";
import { howToBrewApi } from "../../services/howToBrew";
import { productsApi } from "../../services/products";

const initialState = {
  filteredProducts: [],
  fetchedProductsData: undefined,
  parsedFilters: [],
  appliedFilters: [],
  featuredProducts: [],
  activeFilters: {
    brewing: [],
    brewing_method: [],
    country: [],
    note: [],
    taste: [],
    sortBy: [],
    tags: [],
    tool_category: [],
    searchPhrase: "",
  },
  filterValues: {
    brewing_method: "none",
    country: "none",
    tool_category: "none",
    taste: {
      majorNote: {
        name: "none",
        translationName: {
          en: "",
          ar: "",
        },
      },
      minorNote: {
        name: "none",
        translationName: {
          en: "",
          ar: "",
        },
      },
      flavor: {
        name: "none",
        translationName: {
          en: "",
          ar: "",
        },
      },
    },
    sortBy: "none",
    tags: [],
    searchPhrase: "",
  },
  filtersToApply: {
    brewing_method: [],
    country: [],
    sortBy: [],
    tags: [],
    taste: [],
    tool_category: [],
    searchPhrase: "",
  },
  mainCategory: "Coffee",
  filtersList: null,
  countryList: [],
  brewingMethodList: [],
  filterApplied: false,
  searchPackage: "",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilter(state, action) {
      state.activeFilters = {
        ...state.activeFilters,
        [action.payload.key]: action.payload.value,
      };
    },
    setFilterValues(state, action) {
      state.filterValues = {
        ...state.filterValues,
        ...action.payload,
      };
      state.filterApplied = true;
    },
    setTaste(state, action) {
      state.filterValues.taste = {
        ...initialState.filterValues.taste,
        ...action.payload,
      };
      state.filterApplied = true;
    },
    resetFilterValues(state) {
      state.filterValues = {
        brewing_method: "none",
        country: "none",
        taste: {
          ...initialState.filterValues.taste,
        },
        sortBy: "none",
        tool_category: "none",
        tags: [false, false, false],
      };
      state.filterApplied = false;
    },
    resetFilters(state) {
      state.activeFilters = initialState.activeFilters;
      state.filtersToApply = initialState.filtersToApply;
    },
    resetBrewing(state) {
      state.activeFilters.brewing = [];
    },

    resetCountry(state) {
      state.activeFilters.country = [];
    },

    resetNote(state) {
      state.activeFilters.note = [];
    },

    setSearchPackage(state, action) {
      state.searchPackage = action.payload;
    },

    resetSearch(state) {
      state.searchPackage = ""
      state.activeFilters.searchPhrase = ""
    },
    collectFiltersToApply(state, action) {
      if (action.payload.value.length === 0) {
        state.filtersToApply[action.payload.key] = [];
      }
      state.filtersToApply[action.payload.key] = action.payload.value;
      state.filterApplied = true;
    },
    applyCollectedFilters(state) {
      Object.keys(state.filtersToApply).forEach((key) => {
        state.activeFilters[key] = state.filtersToApply[key];
      });
    },
    setMainCategory(state, action) {
      state.mainCategory = action.payload;

      Object.keys(state.activeFilters).forEach((key) => {
        state.activeFilters[key] = [];
      });

      state.filterValues = {
        brewing_method: "none",
        country: "none",
        taste: {
          ...initialState.filterValues.taste,
        },
        sortBy: "none",
        tool_category: "none",
        tags: [false, false],
      };
    },
    setParsedFilters(state, action) {
      state.parsedFilters = action.payload;
    },
    setFeaturedProducts(state, action) {
      state.featuredProducts = action.payload;
    },
    setAppliedFilters(state, action) {
      state.appliedFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      productsApi.endpoints.getProductFilters.matchFulfilled,
      (state, action) => {
        state.filtersList = action.payload;
        state.filterValues.tags = [
          ...Array(action.payload.tags.length).fill(false),
        ];
      }
    );
    builder.addMatcher(
      howToBrewApi.endpoints.getFilters.matchFulfilled,
      (state, action) => {
        state.brewingMethodList = action.payload;
      }
    );
    builder.addMatcher(
      productsApi.endpoints.getProducts.matchFulfilled,
      (state, action) => {
        state.fetchedProductsData = action.payload;
      }
    );
    builder.addMatcher(
      productsApi.endpoints.getFeaturedProducts.matchFulfilled,
      (state, action) => {
        state.featuredProducts = action.payload;
      }
    );
  },
});

export const {
  setMainCategory,
  setFilter,
  resetFilters,
  setFilterValues,
  collectFiltersToApply,
  resetFilterValues,
  setTaste,
  applyCollectedFilters,
  setParsedFilters,
  setFeaturedProducts,
  setAppliedFilters,
  resetNote,
  resetBrewing,
  resetCountry,
  setSearchPackage,
  resetSearch
} = productsSlice.actions;

export const productsReducer = productsSlice.reducer;

