// Third-party
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Store
import { selectIsAuthenticated, selectUserRole } from "../store/authSlice";

// Utils
import { getDashboardRouteForRole } from "../utils/authRedirect";

// Constants / Locales
import ROUTES from "../locales/routes";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { LOGIN } = ROUTES;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to={LOGIN} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={getDashboardRouteForRole(role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
