// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { STOCK_ALERTS } = API_ENDPOINTS;
const { COMMON } = en;

export const getMyStockAlerts = async () => {
  try {
    const { data } = await axiosInstance.get(`${STOCK_ALERTS}/mine`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const createStockAlert = async (productId) => {
  try {
    const { data } = await axiosInstance.post(STOCK_ALERTS, { product_id: productId });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const deleteStockAlert = async (productId) => {
  try {
    await axiosInstance.delete(`${STOCK_ALERTS}/${productId}`);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
