export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
  "replaced",
];

export const getOrderStatusLabel = (status) => (
  status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : ""
);
