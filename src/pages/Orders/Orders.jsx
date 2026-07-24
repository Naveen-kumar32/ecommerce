// Third-party
import { useEffect, useState } from "react";

// Components
import { EmptyState, PageHeader, StatusBadge } from "../../components";

// API
import { getMyOrders } from "../../api/orderApi";

// Constants / Locales
import { getOrderStatusLabel } from "../../constants/orderStatus";
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Utils
import { showError } from "../../utils/errorToast";

// Styles
import "./Orders.css";

const Orders = () => {
  const {
    COMMON: { LOADING },
    ORDERS: { EMPTY_STATE, KICKER, ORDER_LABEL, PLACED_ON, SHOP_LINK, STATUS_LABEL, TITLE, TOTAL_LABEL },
  } = en;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page-body">
      <PageHeader kicker={KICKER} title={TITLE} />

      {loading ? (
        <p>{LOADING}</p>
      ) : orders.length === 0 ? (
        <EmptyState message={EMPTY_STATE} actionTo={ROUTES.SHOP} actionLabel={SHOP_LINK} />
      ) : (
        <div className="orders-page-list">
          {orders.map((order) => (
            <article className="orders-page-card" key={order.id}>
              <div className="orders-page-card-header">
                <strong>{ORDER_LABEL} #{order.id}</strong>
                <StatusBadge status={order.status} />
              </div>
              <p className="orders-page-meta">
                {PLACED_ON} {new Date(order.created_at).toLocaleString()}
              </p>
              <div className="orders-page-items">
                {order.items.map((item) => (
                  <div className="orders-page-item" key={`${order.id}-${item.product_id}`}>
                    <span>{item.product_name_snapshot} × {item.quantity}</span>
                    <span>${Number(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="orders-page-footer">
                <span>{STATUS_LABEL}: {getOrderStatusLabel(order.status)}</span>
                <strong>{TOTAL_LABEL}: ${Number(order.total_amount).toFixed(2)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
