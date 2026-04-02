// Third-party
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import { Login, Register, Dashboard } from "../pages";

// Constants / Locales
import ROUTES from "../locales/routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;