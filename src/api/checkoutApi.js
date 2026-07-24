// Config
import axiosInstance from "../config/axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

// Constants / Locales
import en from "../locales/en";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { CHECKOUT } = API_ENDPOINTS;
const { COMMON } = en;

export const getCheckoutSummary = async (buyNow) => {
  try {
    const { data } = await axiosInstance.post(CHECKOUT.SUMMARY, { buy_now: buyNow ?? null });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const createRazorpayOrder = async ({ addressId, buyNow }) => {
  try {
    const { data } = await axiosInstance.post(CHECKOUT.CREATE_ORDER, {
      address_id: addressId,
      buy_now: buyNow ?? null,
    });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};

export const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  addressId,
  paymentMethodId,
  buyNow,
}) => {
  try {
    const { data } = await axiosInstance.post(CHECKOUT.VERIFY_PAYMENT, {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      address_id: addressId,
      payment_method_id: paymentMethodId ?? null,
      buy_now: buyNow ?? null,
    });
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, COMMON.ERROR_FALLBACK));
  }
};
