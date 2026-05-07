// Third-party
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// Layouts
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";

// Constants / Locales
import ROUTES from "../locales/routes";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));

const { LOGIN, REGISTER, DASHBOARD } = ROUTES;

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: REGISTER, element: <Register /> },
      { path: LOGIN, element: <Login /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: DASHBOARD, element: <Dashboard /> },
    ],
  },
]);

export default router;
