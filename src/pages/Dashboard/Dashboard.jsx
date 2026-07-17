// Third-party
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Store
import { selectAuth, selectIsAdmin } from "../../store/authSlice";

// Constants
import { getUserRoleLabel, USER_ROLES } from "../../constants/userRoles";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Styles
import "./Dashboard.css";

const Dashboard = () => {
  const { ADMIN_DASHBOARD } = ROUTES;
  const {
    DASHBOARD: {
      ACTIONS,
      ARIA_ACCOUNT_OVERVIEW,
      CUSTOMER_KICKER,
      EMAIL_LABEL,
      ORDERS,
      ORDER_ACTIVITY_TITLE,
      PRODUCTS,
      QUICK_ACTIONS_TITLE,
      RECOMMENDED_PRODUCTS_TITLE,
      ROLE_LABEL,
      STATUS_LABEL,
      STATUS_VALUE,
      SUBTITLE,
      WELCOME,
    },
    ROLES,
  } = en;
  const { email, role, username } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const roleLabel = getUserRoleLabel(role, ROLES);

  if (isAdmin) {
    return <Navigate to={ADMIN_DASHBOARD} replace />;
  }

  return (
    <div className="dashboard-body">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-kicker">{CUSTOMER_KICKER}</span>
          <h1 className="dashboard-welcome">
            {WELCOME}{username ? `, ${username}` : ""}
          </h1>
          <p className="dashboard-sub">{SUBTITLE}</p>
        </div>
      </section>

      <section className="dashboard-summary" aria-label={ARIA_ACCOUNT_OVERVIEW}>
        <article>
          <span>{EMAIL_LABEL}</span>
          <strong>{email}</strong>
        </article>
        <article>
          <span>{ROLE_LABEL}</span>
          <strong>{roleLabel}</strong>
        </article>
        <article>
          <span>{STATUS_LABEL}</span>
          <strong>{STATUS_VALUE}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <h2>{ORDER_ACTIVITY_TITLE}</h2>
          <div className="order-list">
            {ORDERS.map((order) => (
              <article key={order.label}>
                <span>{order.label}</span>
                <strong>{order.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>{RECOMMENDED_PRODUCTS_TITLE}</h2>
          <div className="product-list">
            {PRODUCTS.map((product) => (
              <article key={product.label}>
                <div>
                  <span>{product.meta}</span>
                  <strong>{product.label}</strong>
                </div>
                <button type="button">{product.price}</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>{QUICK_ACTIONS_TITLE}</h2>
        <div className="dashboard-actions">
          <button type="button">{ACTIONS.CONTINUE_SHOPPING}</button>
          <button type="button">{ACTIONS.VIEW_CART}</button>
          <button type="button">{ACTIONS.TRACK_ORDER}</button>
          {role === USER_ROLES.SALES && (
            <button type="button">{ACTIONS.OPEN_SALES_LEADS}</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
