// Third-party
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Components
import { PageHeader, StatCard } from "../../components";

// Store
import { selectUserEmail, selectUsername } from "../../store/authSlice";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Styles
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const username = useSelector(selectUsername);
  const email = useSelector(selectUserEmail);
  const {
    ADMIN_DASHBOARD: {
      ACTIONS,
      ARIA_STORE_OVERVIEW,
      KICKER,
      PANEL_TITLE,
      PROFILE_LABEL,
      STATS,
      SUBTITLE,
      WELCOME,
    },
    ADMIN_ORDERS: { TITLE: ORDERS_TITLE },
    ADMIN_PRODUCTS: { TITLE: PRODUCTS_TITLE },
  } = en;

  return (
    <div className="admin-dashboard-body">
      <PageHeader
        kicker={KICKER}
        title={`${WELCOME}${username ? `, ${username}` : ""}`}
        subtitle={SUBTITLE}
        actions={(
          <div className="admin-profile">
            <span>{PROFILE_LABEL}</span>
            <strong>{email || username}</strong>
          </div>
        )}
      />

      <section className="admin-quick-links">
        <Link className="admin-manage-link" to={ROUTES.ADMIN_PRODUCTS}>{PRODUCTS_TITLE}</Link>
        <Link className="admin-manage-link" to={ROUTES.ADMIN_ORDERS}>{ORDERS_TITLE}</Link>
      </section>

      <section className="admin-stats" aria-label={ARIA_STORE_OVERVIEW}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="admin-panel">
        <h2>{PANEL_TITLE}</h2>
        <div className="admin-actions">
          {ACTIONS.map((action) => (
            <button type="button" key={action}>
              {action}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
