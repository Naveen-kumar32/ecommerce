// Third-party
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import { PageHeader, ProductCard } from "../../components";

// API
import { addToCart } from "../../api/cartApi";
import { getCategories, getProductImageUrl, getShopProducts } from "../../api/productApi";
import { createStockAlert, getMyStockAlerts } from "../../api/stockAlertApi";

// Store
import { setCartCount } from "../../store/cartSlice";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Utils
import { showError } from "../../utils/errorToast";
import { showSuccess } from "../../utils/successToast";

// Styles
import "./Shop.css";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    COMMON: { LOADING },
    SHOP: {
      ADDED_TO_CART,
      ADD_TO_CART,
      BUY_NOW,
      CATEGORY_ALL,
      EMPTY_STATE,
      KICKER,
      NOTIFY_ME,
      NOTIFY_REQUESTED,
      OUT_OF_STOCK,
      SEARCH_PLACEHOLDER,
      SUBTITLE,
      TITLE,
    },
  } = en;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscribedAlerts, setSubscribedAlerts] = useState(new Set());

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => showError(err.message));
    getMyStockAlerts()
      .then((alerts) => setSubscribedAlerts(new Set(alerts.map((alert) => alert.product_id))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    getShopProducts({ categoryId: categoryId || undefined, search: search || undefined })
      .then(setProducts)
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  const handleAddToCart = async (product) => {
    try {
      const cart = await addToCart(product.id, 1);
      dispatch(setCartCount(cart.total_count));
      showSuccess(ADDED_TO_CART);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleBuyNow = (product) => {
    navigate(ROUTES.CHECKOUT, { state: { buyNow: { product_id: product.id, quantity: 1 } } });
  };

  const handleNotifyMe = async (product) => {
    try {
      await createStockAlert(product.id);
      setSubscribedAlerts((prev) => new Set(prev).add(product.id));
      showSuccess(NOTIFY_REQUESTED);
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="shop-page-body">
      <PageHeader kicker={KICKER} title={TITLE} subtitle={SUBTITLE} />

      <div className="shop-page-filters">
        <input
          type="text"
          placeholder={SEARCH_PLACEHOLDER}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">{CATEGORY_ALL}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>{LOADING}</p>
      ) : products.length === 0 ? (
        <p>{EMPTY_STATE}</p>
      ) : (
        <div className="shop-page-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              imageUrl={product.has_image ? getProductImageUrl(product.id) : null}
              outOfStockLabel={OUT_OF_STOCK}
              addToCartLabel={ADD_TO_CART}
              buyNowLabel={BUY_NOW}
              notifyMeLabel={NOTIFY_ME}
              notifyRequestedLabel={NOTIFY_REQUESTED}
              isNotifySubscribed={subscribedAlerts.has(product.id)}
              onAddToCart={() => handleAddToCart(product)}
              onBuyNow={() => handleBuyNow(product)}
              onNotifyMe={() => handleNotifyMe(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
