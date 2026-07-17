/* eslint-disable react-refresh/only-export-components */
// Third-party
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// Layouts
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";

// Constants / Locales
import { USER_ROLES } from "../constants/userRoles";
import ROUTES from "../locales/routes";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard/AdminDashboard"));

const { ADMIN_DASHBOARD, DASHBOARD, HOME, LOGIN, REGISTER } = ROUTES;

const router = createBrowserRouter([
  { path: HOME, element: <Home /> },
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
  {
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ADMIN_DASHBOARD, element: <AdminDashboard /> },
    ],
  },
]);

export default router;
