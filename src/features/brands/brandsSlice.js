import { createSlice } from "@reduxjs/toolkit";

import { brandsApi } from "../../services/brands";

const initialState = {
  filters: [],
};

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      brandsApi.endpoints.getBrands.matchFulfilled,
      (state, action) => {
        state.filters = action.payload;
      }
    );
  },
});

export default brandsSlice.reducer;
