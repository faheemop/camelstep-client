import { createSlice } from '@reduxjs/toolkit';
import { howToBrewApi } from '../../services/howToBrew';
import { productsApi } from '../../services/products';

const cupsNumber = 1;
const initialState = {
  tasteWheelMajorNote: {
    majorNote: {
      name: 'none',
      translationName: {
        en: '',
        ar: '',
      },
    },
  },
  filteredBrewingMethods: [],
  filters: [],
  activeFilter: null,
  baristaModeEnabled: false,
  numberOfCups: 200,
  maxWaterInTool: 0,
  default_ratio: 0,
  alternate_ratios: [],
  brewingMethodDetailedValues: {
    grams: 0,
    waterAmount: cupsNumber * 200,
    temperature: 0,
    ratio: 0,
  },
};

const howToBrewSlice = createSlice({
  name: 'howToBrew',
  initialState,
  reducers: {
    setFilteredBrewingMethods: (state, action) => {
      state.filteredBrewingMethods = action.payload;
    },
    setTasteWheelMajorNote: (state, action) => {
      state.tasteWheelMajorNote = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setBaristaMode: (state, action) => {
      state.baristaModeEnabled = action.payload;
    },
    setNumberOfCups: (state, action) => {
      state.numberOfCups = action.payload;
    },
    setBrewingMethodDetailedValues: (state, action) => {
      state.brewingMethodDetailedValues[action.payload.id] = action.payload.value;
    },
    setBreingwMethodValues: (state, action) => {
      state.brewingMethodDetailedValues.temperature = action.payload.temperature_in_celcius;
      state.brewingMethodDetailedValues.ratio = action.payload.default_ratio;
      state.default_ratio = action.payload.default_ratio;
      state.maxWaterInTool = action.payload.max_water_in_tool_in_ml;
      state.alternate_ratios = action.payload.alternate_ratios;
      state.brewingMethodDetailedValues.grams = Number.parseFloat(state.brewingMethodDetailedValues.waterAmount / state.brewingMethodDetailedValues.ratio).toFixed(2);
    },
    resetFilters: (state) => {
      state.tasteWheelMajorNote = initialState.tasteWheelMajorNote;
      state.filteredBrewingMethods = state.filters;
      state.activeFilter = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(howToBrewApi.endpoints.getFilters.matchFulfilled, (state, action) => {
      state.filters = action.payload;
      state.filteredBrewingMethods = action.payload;
    });
    builder.addMatcher(productsApi.endpoints.getProductRecipe.matchFulfilled, (state, action) => {
      state.brewingMethodDetailedValues.temperature = action.payload.temperature_in_celcius;
      state.brewingMethodDetailedValues.ratio = action.payload.default_ratio;
      state.default_ratio = action.payload.default_ratio;
      state.maxWaterInTool = action.payload.max_water_in_tool_in_ml;
      state.alternate_ratios = action.payload.alternate_ratios;
      state.brewingMethodDetailedValues.grams = Number.parseFloat(state.brewingMethodDetailedValues.waterAmount / state.brewingMethodDetailedValues.ratio).toFixed(2);
    });
  },
});

export const {
  setTasteWheelMajorNote,
  setFilteredBrewingMethods,
  setFilters,
  setActiveFilter,
  setBaristaMode,
  setNumberOfCups,
  setBrewingMethodDetailedValues,
  setBreingwMethodValues,
  resetFilters,
} = howToBrewSlice.actions;

export default howToBrewSlice.reducer;
