const API_ENDPOINTS = {
  ADDRESSES: "/addresses",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  CART: "/cart",
  CATEGORIES: "/categories",
  CHECKOUT: {
    CREATE_ORDER: "/checkout/create-order",
    SUMMARY: "/checkout/summary",
    VERIFY_PAYMENT: "/checkout/verify-payment",
  },
  ORDERS: "/orders",
  PAYMENT_METHODS: "/payment-methods",
  PRODUCTS: "/products",
  SELLERS: "/sellers",
  STOCK_ALERTS: "/stock-alerts",
};

export default API_ENDPOINTS;
