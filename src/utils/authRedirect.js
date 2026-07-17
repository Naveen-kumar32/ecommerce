// Constants
import { USER_ROLES } from "../constants/userRoles";
import ROUTES from "../locales/routes";

export const getDashboardRouteForRole = (role) => (
  role === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD
);
