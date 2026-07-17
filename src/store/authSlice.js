// Third-party
import { createSlice } from "@reduxjs/toolkit";

// Constants
import { USER_ROLES } from "../constants/userRoles";

export const AUTH_STORAGE_KEY = "authCredentials";

const LEGACY_AUTH_KEYS = ["token", "username", "email", "role"];

const emptyAuthState = {
  email: "",
  isAuthenticated: false,
  role: "",
  token: "",
  username: "",
};

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const getLegacyAuthState = () => {
  if (!canUseStorage()) return emptyAuthState;

  const token = localStorage.getItem("token") ?? "";
  const username = localStorage.getItem("username") ?? "";
  const email = localStorage.getItem("email") ?? "";
  const role = localStorage.getItem("role") ?? "";

  return {
    email,
    isAuthenticated: Boolean(token),
    role,
    token,
    username,
  };
};

export const getStoredAuthState = () => {
  if (!canUseStorage()) return emptyAuthState;

  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) return getLegacyAuthState();

    const parsedAuth = JSON.parse(storedAuth);
    const token = parsedAuth?.token ?? parsedAuth?.access_token ?? "";

    return {
      email: parsedAuth?.email ?? "",
      isAuthenticated: Boolean(token),
      role: parsedAuth?.role ?? "",
      token,
      username: parsedAuth?.username ?? "",
    };
  } catch {
    return getLegacyAuthState();
  }
};

export const persistAuthState = (authState) => {
  if (!canUseStorage()) return;

  LEGACY_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));

  if (!authState.token) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      email: authState.email,
      role: authState.role,
      token: authState.token,
      username: authState.username,
    }),
  );
};

const authSlice = createSlice({
  name: "auth",
  initialState: getStoredAuthState(),
  reducers: {
    clearCredentials: () => emptyAuthState,
    setCredentials: (_state, action) => {
      const { access_token: accessToken, email, role, token, username } = action.payload ?? {};
      const authToken = token ?? accessToken ?? "";

      return {
        email: email ?? "",
        isAuthenticated: Boolean(authToken),
        role: role ?? USER_ROLES.CUSTOMER,
        token: authToken,
        username: username ?? "",
      };
    },
  },
});

export const { clearCredentials, setCredentials } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectUsername = (state) => state.auth.username;
export const selectUserEmail = (state) => state.auth.email;
export const selectIsAdmin = (state) => state.auth.role === USER_ROLES.ADMIN;

export default authSlice.reducer;
