import { createSlice } from '@reduxjs/toolkit';
import { brewingMethodsApi } from '../../services/brewingMethods';

const initialState = {
  filters: [],
};

const brewingMethodsSlice = createSlice({
  name: 'brewingMethods',
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(brewingMethodsApi.endpoints.getBrewingMethods.matchFulfilled, (state, action) => {
      state.filters = action.payload;
    });
  },
});

export default brewingMethodsSlice.reducer;
