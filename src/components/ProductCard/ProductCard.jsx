// Styles
import "./ProductCard.css";

const ProductCard = ({
  addToCartLabel,
  buyNowLabel,
  imageUrl,
  isNotifySubscribed,
  notifyMeLabel,
  notifyRequestedLabel,
  onAddToCart,
  onBuyNow,
  onNotifyMe,
  outOfStockLabel,
  product,
}) => (
  <article className="product-card">
    <div className="product-card-image">
      {imageUrl ? (
        <img src={imageUrl} alt={product.name} />
      ) : (
        <span className="product-card-image-placeholder" />
      )}
      {!product.in_stock && <span className="product-card-out-badge">{outOfStockLabel}</span>}
    </div>
    <div className="product-card-info">
      <h3>{product.name}</h3>
      {product.description && <p>{product.description}</p>}
      <strong>${Number(product.price).toFixed(2)}</strong>
    </div>
    <div className="product-card-actions">
      {product.in_stock ? (
        <>
          <button type="button" onClick={onAddToCart}>{addToCartLabel}</button>
          <button type="button" className="product-card-buy-now" onClick={onBuyNow}>
            {buyNowLabel}
          </button>
        </>
      ) : (
        <button type="button" disabled={isNotifySubscribed} onClick={onNotifyMe}>
          {isNotifySubscribed ? notifyRequestedLabel : notifyMeLabel}
        </button>
      )}
    </div>
  </article>
);

export default ProductCard;
