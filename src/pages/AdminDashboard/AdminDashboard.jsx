// Third-party
import { useSelector } from "react-redux";

// Store
import { selectUserEmail, selectUsername } from "../../store/authSlice";

// Constants / Locales
import en from "../../locales/en";

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
  } = en;

  return (
    <div className="admin-dashboard-body">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">{KICKER}</span>
          <h1 className="admin-welcome">
            {WELCOME}{username ? `, ${username}` : ""}
          </h1>
          <p className="admin-sub">{SUBTITLE}</p>
        </div>
        <div className="admin-profile">
          <span>{PROFILE_LABEL}</span>
          <strong>{email || username}</strong>
        </div>
      </section>

      <section className="admin-stats" aria-label={ARIA_STORE_OVERVIEW}>
        {STATS.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
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
