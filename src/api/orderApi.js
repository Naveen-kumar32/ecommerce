// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { ORDERS } = API_ENDPOINTS;
const { COMMON } = en;

export const getMyOrders = async () => {
  try {
    const { data } = await axiosInstance.get(ORDERS);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const getAllOrders = async () => {
  try {
    const { data } = await axiosInstance.get(`${ORDERS}/admin/all`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const { data } = await axiosInstance.patch(`${ORDERS}/${id}/status`, { status });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
