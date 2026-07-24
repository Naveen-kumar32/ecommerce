// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { CART } = API_ENDPOINTS;
const { COMMON } = en;

export const getCart = async () => {
  try {
    const { data } = await axiosInstance.get(CART);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const { data } = await axiosInstance.post(CART, { product_id: productId, quantity });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const { data } = await axiosInstance.put(`${CART}/${itemId}`, { quantity });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const { data } = await axiosInstance.delete(`${CART}/${itemId}`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const clearCart = async () => {
  try {
    const { data } = await axiosInstance.delete(CART);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
