// Third-party
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import { EmptyState, PageHeader } from "../../components";

// API
import { getCart, removeCartItem, updateCartItem } from "../../api/cartApi";
import { getProductImageUrl } from "../../api/productApi";

// Store
import { setCartCount } from "../../store/cartSlice";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Utils
import { showError } from "../../utils/errorToast";
import { showSuccess } from "../../utils/successToast";

// Styles
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    CART: { CHECKOUT_BUTTON, CONTINUE_SHOPPING, EMPTY_STATE, ITEM_REMOVED, KICKER, REMOVE, SUBTOTAL_LABEL, TITLE },
    COMMON: { LOADING },
  } = en;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return;

    try {
      const updated = await updateCartItem(item.id, quantity);
      setCart(updated);
      dispatch(setCartCount(updated.total_count));
    } catch (err) {
      showError(err.message);
    }
  };

  const handleRemove = async (item) => {
    try {
      const updated = await removeCartItem(item.id);
      setCart(updated);
      dispatch(setCartCount(updated.total_count));
      showSuccess(ITEM_REMOVED);
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading) {
    return <div className="cart-page-body"><p>{LOADING}</p></div>;
  }

  return (
    <div className="cart-page-body">
      <PageHeader kicker={KICKER} title={TITLE} />

      {!cart || cart.items.length === 0 ? (
        <EmptyState message={EMPTY_STATE} actionTo={ROUTES.SHOP} actionLabel={CONTINUE_SHOPPING} />
      ) : (
        <>
          <div className="cart-page-items">
            {cart.items.map((item) => (
              <article className="cart-page-item" key={item.id}>
                {item.has_image && (
                  <img src={getProductImageUrl(item.product_id)} alt={item.name} />
                )}
                <div className="cart-page-item-info">
                  <strong>{item.name}</strong>
                  <span>${Number(item.price).toFixed(2)}</span>
                </div>
                <div className="cart-page-item-qty">
                  <button type="button" onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    disabled={item.quantity >= item.available_quantity}
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button type="button" className="cart-page-remove" onClick={() => handleRemove(item)}>
                  {REMOVE}
                </button>
              </article>
            ))}
          </div>

          <div className="cart-page-summary">
            <span>{SUBTOTAL_LABEL}</span>
            <strong>${Number(cart.subtotal).toFixed(2)}</strong>
          </div>

          <button type="button" className="cart-page-checkout-btn" onClick={() => navigate(ROUTES.CHECKOUT)}>
            {CHECKOUT_BUTTON}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
