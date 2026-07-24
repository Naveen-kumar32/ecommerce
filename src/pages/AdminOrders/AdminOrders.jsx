// Third-party
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Components
import { PageHeader, StatusBadge } from "../../components";

// API
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";

// Constants / Locales
import { ORDER_STATUSES, getOrderStatusLabel } from "../../constants/orderStatus";
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Utils
import { showError } from "../../utils/errorToast";
import { showSuccess } from "../../utils/successToast";

// Styles
import "./AdminOrders.css";

const AdminOrders = () => {
  const {
    ADMIN_ORDERS: { BACK_LINK, EMPTY_STATE, KICKER, STATUS_UPDATED, SUBTITLE, TABLE, TITLE },
    COMMON: { LOADING },
  } = en;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (order, status) => {
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? updated : item)));
      showSuccess(STATUS_UPDATED);
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="admin-orders-body">
      <PageHeader
        kicker={KICKER}
        title={TITLE}
        subtitle={SUBTITLE}
        actions={<Link className="admin-orders-back-link" to={ROUTES.ADMIN_DASHBOARD}>{BACK_LINK}</Link>}
      />

      <section className="admin-orders-panel">
        {loading ? (
          <p>{LOADING}</p>
        ) : orders.length === 0 ? (
          <p>{EMPTY_STATE}</p>
        ) : (
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>{TABLE.ORDER}</th>
                <th>{TABLE.DATE}</th>
                <th>{TABLE.ITEMS}</th>
                <th>{TABLE.TOTAL}</th>
                <th>{TABLE.STATUS}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.items.map((item) => item.product_name_snapshot).join(", ")}</td>
                  <td>${Number(order.total_amount).toFixed(2)}</td>
                  <td>
                    <div className="admin-orders-status-cell">
                      <StatusBadge status={order.status} />
                      <select value={order.status} onChange={(event) => handleStatusChange(order, event.target.value)}>
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{getOrderStatusLabel(status)}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminOrders;
