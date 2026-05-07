// Third-party
import { Outlet, useNavigate } from "react-router-dom";

// Constants / Locales
import ROUTES from "../../locales/routes";

// Styles
import "./MainLayout.css";

const MainLayout = () => {
  const navigate = useNavigate();
  const { LOGIN } = ROUTES;

  const username = localStorage.getItem("username") ?? "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate(LOGIN);
  };

  return (
    <div className="main-layout">

      <header className="main-header">
        <div className="header-logo">
          React Project
        </div>

        <div className="header-right">
          <span className="header-username">{username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
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
