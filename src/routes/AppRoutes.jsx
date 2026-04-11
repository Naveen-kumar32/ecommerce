// Third-party
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import { Login, Register, Dashboard } from "../pages";

// Constants / Locales
import ROUTES from "../locales/routes";

const AppRoutes = () => {
  const { LOGIN, REGISTER, DASHBOARD } = ROUTES;

  return (
    <BrowserRouter>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={REGISTER} element={<Register />} />
        <Route path={DASHBOARD} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;