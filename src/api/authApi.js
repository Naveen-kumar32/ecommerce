// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Data
import { USERS } from "../data/users";

// Constants / Locales
import en from "../locales/en";

const LOCAL_USERS_STORAGE_KEY = "localUsers";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const isLocalAuthMode = () => import.meta.env.VITE_AUTH_MODE === "local";

const getApiErrorMessage = (err, fallback) => {
  const detail = err.response?.data?.detail;

  return typeof detail === "string"
    ? detail
    : Array.isArray(detail)
    ? detail[0]?.msg || detail[0] || JSON.stringify(detail)
    : err.response?.data?.message || err.message || fallback;
};

const getStoredLocalUsers = () => {
  if (!canUseStorage()) return [];

  try {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_STORAGE_KEY)) ?? [];
    return Array.isArray(storedUsers) ? storedUsers : [];
  } catch {
    return [];
  }
};

const saveStoredLocalUsers = (users) => {
  if (!canUseStorage()) return;

  localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(users));
};

const getLocalUsers = () => [...USERS, ...getStoredLocalUsers()];

const normalizeIdentifier = (value) => value.trim().toLowerCase();

const createLocalAuthResponse = (user) => ({
  access_token: `local-${user.id}-${Date.now()}`,
  email: user.email,
  role: user.role,
  token_type: "bearer",
  username: user.username,
});

const loginWithLocalUsers = ({ identifier, password, role }) => {
  const {
    AUTH: { INVALID_CREDENTIALS, ROLE_MISMATCH },
  } = en;
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const user = getLocalUsers().find(
    (localUser) => (
      normalizeIdentifier(localUser.email) === normalizedIdentifier
      || normalizeIdentifier(localUser.username) === normalizedIdentifier
    ) && localUser.password === password,
  );

  if (!user) {
    throw new Error(INVALID_CREDENTIALS);
  }

  if (role && user.role !== role) {
    throw new Error(ROLE_MISMATCH);
  }

  return createLocalAuthResponse(user);
};

const registerWithLocalUsers = ({ username, email, password, role }) => {
  const {
    AUTH: { EMAIL_ALREADY_EXISTS, USERNAME_TAKEN },
  } = en;
  const localUsers = getLocalUsers();
  const normalizedEmail = normalizeIdentifier(email);
  const normalizedUsername = normalizeIdentifier(username);

  if (localUsers.some((user) => normalizeIdentifier(user.email) === normalizedEmail)) {
    throw new Error(EMAIL_ALREADY_EXISTS);
  }

  if (localUsers.some((user) => normalizeIdentifier(user.username) === normalizedUsername)) {
    throw new Error(USERNAME_TAKEN);
  }

  const storedUsers = getStoredLocalUsers();

  saveStoredLocalUsers([
    ...storedUsers,
    {
      email,
      id: Date.now(),
      password,
      role,
      username,
    },
  ]);

  return { message: en.REGISTER.SUCCESS_MESSAGE };
};

export const loginApi = async ({ identifier, password, role }) => {
  const { LOGIN: { ERROR_FALLBACK } } = en;
  const { AUTH: { LOGIN } } = API_ENDPOINTS;

  if (isLocalAuthMode()) {
    return loginWithLocalUsers({ identifier, password, role });
  }

  try {
    const { data } = await axiosInstance.post(LOGIN, { identifier, password, role });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, ERROR_FALLBACK));
  }
};

export const registerApi = async ({ username, email, password, role }) => {
  const { REGISTER: { ERROR_FALLBACK } } = en;
  const { AUTH: { REGISTER } } = API_ENDPOINTS;

  if (isLocalAuthMode()) {
    return registerWithLocalUsers({ username, email, password, role });
  }

  try {
    const { data } = await axiosInstance.post(REGISTER, { username, email, password, role });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, ERROR_FALLBACK));
  }
};
