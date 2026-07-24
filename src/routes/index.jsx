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
const AdminOrders = lazy(() => import("../pages/AdminOrders/AdminOrders"));
const AdminProducts = lazy(() => import("../pages/AdminProducts/AdminProducts"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Checkout = lazy(() => import("../pages/Checkout/Checkout"));
const Orders = lazy(() => import("../pages/Orders/Orders"));
const SellerDashboard = lazy(() => import("../pages/SellerDashboard/SellerDashboard"));
const Shop = lazy(() => import("../pages/Shop/Shop"));

const {
  ADMIN_DASHBOARD,
  ADMIN_ORDERS,
  ADMIN_PRODUCTS,
  CART,
  CHECKOUT,
  DASHBOARD,
  HOME,
  LOGIN,
  ORDERS,
  REGISTER,
  SELLER_DASHBOARD,
  SHOP,
} = ROUTES;

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
      { path: SHOP, element: <Shop /> },
      { path: CART, element: <Cart /> },
      { path: CHECKOUT, element: <Checkout /> },
      { path: ORDERS, element: <Orders /> },
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
      { path: ADMIN_PRODUCTS, element: <AdminProducts /> },
      { path: ADMIN_ORDERS, element: <AdminOrders /> },
    ],
  },
  {
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.SELLER}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: SELLER_DASHBOARD, element: <SellerDashboard /> },
    ],
  },
]);

export default router;
