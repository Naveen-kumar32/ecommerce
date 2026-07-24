// Constants
import { USER_ROLES } from "../constants/userRoles";
import ROUTES from "../locales/routes";

export const getDashboardRouteForRole = (role) => {
  if (role === USER_ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
  if (role === USER_ROLES.SELLER) return ROUTES.SELLER_DASHBOARD;
  return ROUTES.DASHBOARD;
};
