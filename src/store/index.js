// Third-party
import { configureStore } from "@reduxjs/toolkit";

// Store
import authReducer, { persistAuthState } from "./authSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

let previousAuthState = store.getState().auth;
persistAuthState(previousAuthState);

store.subscribe(() => {
  const currentAuthState = store.getState().auth;

  if (currentAuthState === previousAuthState) return;

  previousAuthState = currentAuthState;
  persistAuthState(currentAuthState);
});
