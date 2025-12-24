import { createSlice } from "@reduxjs/toolkit";
import { locationsApi } from "../../services/locations";

const initialState = {
    filters: [],
};

const locationsSlice = createSlice({
    name: "locations",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            locationsApi.endpoints.getLocations.matchFulfilled,
            (state, action) => {
                state.filters = action.payload;
            }
        );
    },
});

export default locationsSlice.reducer;
