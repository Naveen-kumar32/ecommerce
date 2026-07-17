// Third-party
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

// Store
import { clearCredentials, selectUserRole, selectUsername } from "../../store/authSlice";

// Constants / Locales
import { getUserRoleLabel } from "../../constants/userRoles";
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Styles
import "./MainLayout.css";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { HOME } = ROUTES;
  const {
    COMMON: { LOGOUT },
    MAIN_LAYOUT: { APP_NAME, FALLBACK_USERNAME },
    ROLES,
  } = en;

  const username = useSelector(selectUsername) || FALLBACK_USERNAME;
  const role = useSelector(selectUserRole);
  const roleLabel = getUserRoleLabel(role, ROLES);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate(HOME);
  };

  return (
    <div className="main-layout">

      <header className="main-header">
        <div className="header-logo">
          {APP_NAME}
        </div>

        <div className="header-right">
          <span className="header-username">
            {username}
            {role ? ` (${roleLabel})` : ""}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            {LOGOUT}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
