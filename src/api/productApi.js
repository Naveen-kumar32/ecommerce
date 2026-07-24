// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { CATEGORIES, PRODUCTS } = API_ENDPOINTS;
const { COMMON } = en;

export const getProductImageUrl = (productId) => (
  `${import.meta.env.VITE_API_URL}${PRODUCTS}/${productId}/image`
);

export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get(CATEGORIES);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const createCategory = async (name) => {
  try {
    const { data } = await axiosInstance.post(CATEGORIES, { name });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const getShopProducts = async ({ categoryId, search } = {}) => {
  try {
    const { data } = await axiosInstance.get(PRODUCTS, {
      params: { category_id: categoryId, search },
    });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const getMyProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`${PRODUCTS}/mine`);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const createProduct = async (payload) => {
  try {
    const { data } = await axiosInstance.post(PRODUCTS, payload);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const { data } = await axiosInstance.put(`${PRODUCTS}/${id}`, payload);
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(`${PRODUCTS}/${id}`);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
