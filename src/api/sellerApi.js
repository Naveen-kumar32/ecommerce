// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { SELLERS } = API_ENDPOINTS;
const { COMMON } = en;

export const getMySellerProfile = async () => {
  try {
    const { data } = await axiosInstance.get(`${SELLERS}/me`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const updateMySellerProfile = async (payload) => {
  try {
    const { data } = await axiosInstance.put(`${SELLERS}/me`, payload);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
