// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { ADDRESSES } = API_ENDPOINTS;
const { COMMON } = en;

export const getAddresses = async () => {
  try {
    const { data } = await axiosInstance.get(ADDRESSES);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const createAddress = async (payload) => {
  try {
    const { data } = await axiosInstance.post(ADDRESSES, payload);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const deleteAddress = async (id) => {
  try {
    await axiosInstance.delete(`${ADDRESSES}/${id}`);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const setDefaultAddress = async (id) => {
  try {
    const { data } = await axiosInstance.put(`${ADDRESSES}/${id}/default`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
