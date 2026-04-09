// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

export const loginApi = async ({ email, password }) => {
  const { LOGIN: { ERROR_FALLBACK } } = en;
  const { AUTH: { LOGIN } } = API_ENDPOINTS;

  try {
    const { data } = await axiosInstance.post(LOGIN, { email, password });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.detail ?? ERROR_FALLBACK);
  }
};

export const registerApi = async ({ name, email, password }) => {
  const { REGISTER: { ERROR_FALLBACK } } = en;
  const { AUTH: { REGISTER } } = API_ENDPOINTS;

  try {
    const { data } = await axiosInstance.post(REGISTER, { name, email, password });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.detail ?? ERROR_FALLBACK);
  }
};