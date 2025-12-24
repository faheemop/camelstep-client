import { createSlice } from '@reduxjs/toolkit';

const initialState = { isOpen: false };

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = !state.isOpen; //eslint-disable-line
    },
    closeMenu: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, closeMenu } = menuSlice.actions;
export default menuSlice.reducer;
