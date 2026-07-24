// Third-party
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Components
import { PageHeader, StatCard } from "../../components";

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
  const { ADMIN_DASHBOARD, SELLER_DASHBOARD } = ROUTES;
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

  if (role === USER_ROLES.SELLER) {
    return <Navigate to={SELLER_DASHBOARD} replace />;
  }

  return (
    <div className="dashboard-body">
      <PageHeader
        kicker={CUSTOMER_KICKER}
        title={`${WELCOME}${username ? `, ${username}` : ""}`}
        subtitle={SUBTITLE}
      />

      <section className="dashboard-summary" aria-label={ARIA_ACCOUNT_OVERVIEW}>
        <StatCard label={EMAIL_LABEL} value={email} />
        <StatCard label={ROLE_LABEL} value={roleLabel} />
        <StatCard label={STATUS_LABEL} value={STATUS_VALUE} />
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
