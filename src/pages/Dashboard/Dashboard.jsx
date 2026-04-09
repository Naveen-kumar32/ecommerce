// Constants / Locales
import en from "../../locales/en";

const Dashboard = () => {
  const { DASHBOARD: { WELCOME } } = en;

  return (
    <div>
      <h1>{WELCOME}</h1>
    </div>
  );
};

export default Dashboard;