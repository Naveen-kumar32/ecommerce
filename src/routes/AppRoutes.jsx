// Third-party
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

// Constants / Locales
import en from "../locales/en";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={en.ROUTES.LOGIN} element={<Login />} />
        <Route path={en.ROUTES.REGISTER} element={<Register />} />
        <Route path={en.ROUTES.DASHBOARD} element={<Dashboard strings={en.DASHBOARD} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;