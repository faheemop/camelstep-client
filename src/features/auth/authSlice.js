import { createSlice } from '@reduxjs/toolkit';
import { CurrentUser } from '../../helpers/CurrentUser';
import { authApi } from '../../services/api';

const initialState = {
  isUserLoggedIn: CurrentUser.get()?.token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refreshTokenReceived: (state, action) => {
      CurrentUser.set(action.payload);
      state.isUserLoggedIn = true;
    },
    logUserOut: (state) => {
      CurrentUser.delete();
      state.isUserLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.confirmLoginCode.matchFulfilled,
      (state) => {
        state.isUserLoggedIn = true;
      },
    )
      .addMatcher(
        authApi.endpoints.googleSession.matchFulfilled,
        (state) => {
          state.isUserLoggedIn = true;
        },
      )
      .addMatcher(
        authApi.endpoints.logoutUser.matchFulfilled,
        (state) => {
          state.isUserLoggedIn = false;
        },
      );
  },
});

export default authSlice.reducer;
export const { refreshTokenReceived, logUserOut } = authSlice.actions;
export const selectIfUserIsLoggedIn = (state) => state.auth.isUserLoggedIn;
