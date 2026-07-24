// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { PAYMENT_METHODS } = API_ENDPOINTS;
const { COMMON } = en;

export const getPaymentMethods = async () => {
  try {
    const { data } = await axiosInstance.get(PAYMENT_METHODS);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const createPaymentMethod = async (payload) => {
  try {
    const { data } = await axiosInstance.post(PAYMENT_METHODS, payload);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const deletePaymentMethod = async (id) => {
  try {
    await axiosInstance.delete(`${PAYMENT_METHODS}/${id}`);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const setDefaultPaymentMethod = async (id) => {
  try {
    const { data } = await axiosInstance.put(`${PAYMENT_METHODS}/${id}/default`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
