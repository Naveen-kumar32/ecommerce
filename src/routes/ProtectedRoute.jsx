// Third-party
import { Navigate } from "react-router-dom";

// Constants / Locales
import ROUTES from "../locales/routes";

const ProtectedRoute = ({ children }) => {
  const { LOGIN } = ROUTES;
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
