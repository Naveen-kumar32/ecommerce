// Constants / Locales
import en from "../../locales/en";

// Styles
import "./Dashboard.css";

const Dashboard = () => {
  const { DASHBOARD: { WELCOME } } = en;
  const username = localStorage.getItem("username") ?? "";

  return (
    <div className="dashboard-body">
      <h1 className="dashboard-welcome">
        {WELCOME}{username ? `, ${username}` : ""}
      </h1>
      <p className="dashboard-sub">
        Here's your command center. More features coming soon.
      </p>
    </div>
  );
};

export default Dashboard;
