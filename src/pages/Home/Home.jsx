// Third-party
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Assets
import heroImage from "../../assets/hero.png";

// Constants / Locales
import { getUserRoleLabel } from "../../constants/userRoles";
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Store
import { clearCredentials, selectAuth, selectIsAdmin } from "../../store/authSlice";

// Styles
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ADMIN_DASHBOARD, DASHBOARD, HOME: HOME_ROUTE, LOGIN, REGISTER } = ROUTES;
  const {
    COMMON: { LOGOUT },
    HOME: {
      ACCOUNT_ARIA,
      ACCOUNT_TYPE_LABEL,
      ADMIN_BUTTON,
      BRAND,
      DASHBOARD_BUTTON,
      EMAIL_LABEL,
      HERO_CTA,
      HERO_DESCRIPTION,
      HERO_LOGIN_CTA,
      HERO_TITLE,
      KICKER,
      LOGIN_BUTTON,
      NAV_ARIA,
      NAV_OFFERS,
      NAV_PRODUCTS,
      NAV_SUPPORT,
      PRODUCTS,
      PRODUCT_SECTION_KICKER,
      PRODUCT_SECTION_TITLE,
      SERVICE_BAND,
      SIGNED_IN_LABEL,
      SIGNUP_BUTTON,
    },
    ROLES,
  } = en;
  const { email, isAuthenticated: isLoggedIn, role, username } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const roleLabel = getUserRoleLabel(role, ROLES);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate(LOGIN);
  };

  return (
    <div className="shop-home">
      <header className="shop-header">
        <Link className="shop-logo" to={HOME_ROUTE}>
          {BRAND}
        </Link>

        <nav className="shop-nav" aria-label={NAV_ARIA}>
          <a href="#products">{NAV_PRODUCTS}</a>
          <a href="#offers">{NAV_OFFERS}</a>
          <a href="#support">{NAV_SUPPORT}</a>
        </nav>

        <div className="shop-actions">
          {isLoggedIn ? (
            <>
              <div className="shop-user">
                <span>{username}</span>
                <small>{email}</small>
              </div>
              {isAdmin && (
                <Link className="shop-btn shop-btn-primary" to={ADMIN_DASHBOARD}>
                  {ADMIN_BUTTON}
                </Link>
              )}
              {!isAdmin && (
                <Link className="shop-btn shop-btn-primary" to={DASHBOARD}>
                  {DASHBOARD_BUTTON}
                </Link>
              )}
              <button className="shop-btn" type="button" onClick={handleLogout}>
                {LOGOUT}
              </button>
            </>
          ) : (
            <>
              <Link className="shop-btn" to={LOGIN}>
                {LOGIN_BUTTON}
              </Link>
              <Link className="shop-btn shop-btn-primary" to={REGISTER}>
                {SIGNUP_BUTTON}
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <span className="shop-kicker">{KICKER}</span>
            <h1>{HERO_TITLE}</h1>
            <p>{HERO_DESCRIPTION}</p>
            <div className="shop-hero-actions">
              <a className="shop-btn shop-btn-primary" href="#products">
                {HERO_CTA}
              </a>
              {!isLoggedIn && (
                <Link className="shop-btn" to={LOGIN}>
                  {HERO_LOGIN_CTA}
                </Link>
              )}
            </div>
          </div>

          <div className="shop-hero-media" aria-hidden="true">
            <img src={heroImage} alt="" />
          </div>
        </section>

        {isLoggedIn && (
          <section className="account-strip" aria-label={ACCOUNT_ARIA}>
            <div>
              <span>{SIGNED_IN_LABEL}</span>
              <strong>{username}</strong>
            </div>
            <div>
              <span>{EMAIL_LABEL}</span>
              <strong>{email}</strong>
            </div>
            <div>
              <span>{ACCOUNT_TYPE_LABEL}</span>
              <strong>{roleLabel}</strong>
            </div>
          </section>
        )}

        <section className="product-section" id="products">
          <div className="section-heading">
            <span>{PRODUCT_SECTION_KICKER}</span>
            <h2>{PRODUCT_SECTION_TITLE}</h2>
          </div>

          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image">
                  <span>{product.badge}</span>
                </div>
                <div className="product-info">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <strong>{product.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="service-band" id="offers">
          {SERVICE_BAND.map((service, index) => (
            <div
              id={index === SERVICE_BAND.length - 1 ? "support" : undefined}
              key={service.label}
            >
              <span>{service.label}</span>
              <strong>{service.value}</strong>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
