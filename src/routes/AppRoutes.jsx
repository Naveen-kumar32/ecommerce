// Third-party
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

// Constants / Locales
import en from "../locales/en";
import ROUTES from "../locales/routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard strings={en.DASHBOARD} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;