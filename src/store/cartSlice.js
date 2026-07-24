// Third-party
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { count: 0 },
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    resetCartCount: (state) => {
      state.count = 0;
    },
  },
});

export const { resetCartCount, setCartCount } = cartSlice.actions;

export const selectCartCount = (state) => state.cart.count;

export default cartSlice.reducer;
