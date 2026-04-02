// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

export const loginApi = async ({ email, password }) => {
  try {
    const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.detail ?? en.LOGIN.ERROR_FALLBACK);
  }
};

export const registerApi = async ({ name, email, password }) => {
  try {
    const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, { name, email, password });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.detail ?? en.REGISTER.ERROR_FALLBACK);
  }
};