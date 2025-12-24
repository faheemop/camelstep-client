import { createSlice } from '@reduxjs/toolkit';
import { cartApi } from '../../services/cart';

const initialState = { isOpen: false, isLocked: false };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCartModal: (state) => {
      state.isOpen = !state.isOpen; //eslint-disable-line
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.getCartProducts.matchFulfilled,
      (state, action) => {
        state.isLocked = action.payload.cart_lock;
      },
    );
  },
});

export const { toggleCartModal } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
