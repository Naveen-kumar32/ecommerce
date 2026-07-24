// Third-party
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";

// API
import { getCart } from "../../api/cartApi";

// Store
import { clearCredentials, selectUserRole, selectUsername } from "../../store/authSlice";
import { resetCartCount, selectCartCount, setCartCount } from "../../store/cartSlice";

// Constants / Locales
import { getUserRoleLabel, USER_ROLES } from "../../constants/userRoles";
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Styles
import "./MainLayout.css";

const SHOPPER_ROLES = [USER_ROLES.CUSTOMER, USER_ROLES.SALES, USER_ROLES.SUPPORT];

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { CART, HOME, ORDERS, SHOP } = ROUTES;
  const {
    CART: { HEADER_LABEL },
    COMMON: { LOGOUT },
    MAIN_LAYOUT: { APP_NAME, FALLBACK_USERNAME },
    ORDERS: { KICKER: ORDERS_LABEL },
    ROLES,
    SHOP: { KICKER: SHOP_LABEL },
  } = en;

  const username = useSelector(selectUsername) || FALLBACK_USERNAME;
  const role = useSelector(selectUserRole);
  const cartCount = useSelector(selectCartCount);
  const roleLabel = getUserRoleLabel(role, ROLES);
  const canShop = SHOPPER_ROLES.includes(role);

  useEffect(() => {
    if (canShop) {
      getCart().then((cart) => dispatch(setCartCount(cart.total_count))).catch(() => {});
    }
  }, [canShop, dispatch]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(resetCartCount());
    navigate(HOME);
  };

  return (
    <div className="main-layout">

      <header className="main-header">
        <div className="header-logo">
          {APP_NAME}
        </div>

        <div className="header-right">
          {canShop && (
            <nav className="header-nav">
              <Link to={SHOP}>{SHOP_LABEL}</Link>
              <Link to={ORDERS}>{ORDERS_LABEL}</Link>
              <Link className="header-cart-link" to={CART}>
                {HEADER_LABEL}
                {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
              </Link>
            </nav>
          )}
          <span className="header-username">
            {username}
            {role ? ` (${roleLabel})` : ""}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            {LOGOUT}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
