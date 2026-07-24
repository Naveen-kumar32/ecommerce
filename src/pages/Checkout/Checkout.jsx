// Third-party
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import { PageHeader } from "../../components";

// API
import { getAddresses, createAddress } from "../../api/addressApi";
import { createRazorpayOrder, getCheckoutSummary, verifyPayment } from "../../api/checkoutApi";
import { createPaymentMethod, getPaymentMethods } from "../../api/paymentMethodApi";

// Store
import { setCartCount } from "../../store/cartSlice";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

// Utils
import { showError } from "../../utils/errorToast";
import { showSuccess } from "../../utils/successToast";

// Styles
import "./Checkout.css";

const emptyAddressForm = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNow = location.state?.buyNow ?? null;

  const {
    CHECKOUT: {
      ADDRESS_FORM,
      ADDRESS_TITLE,
      ADD_ADDRESS_BUTTON,
      ADD_PAYMENT_BUTTON,
      CARD_HOLDER_PLACEHOLDER,
      CARD_LABEL,
      CARD_NUMBER_PLACEHOLDER,
      KICKER,
      NO_ADDRESS,
      NO_PAYMENT,
      ORDER_SUMMARY_TITLE,
      PAYMENT_NOTE,
      RAZORPAY_UNAVAILABLE,
      PAYING_BUTTON,
      PAYMENT_TITLE,
      PAY_BUTTON,
      SUCCESS_MESSAGE,
      TITLE,
      TOTAL_LABEL,
      UPI_LABEL,
      UPI_VPA_PLACEHOLDER,
    },
    COMMON: { CANCEL, LOADING, SAVE },
  } = en;

  const [summary, setSummary] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [paymentType, setPaymentType] = useState("upi");
  const [vpa, setVpa] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  useEffect(() => {
    Promise.all([getCheckoutSummary(buyNow), getAddresses(), getPaymentMethods()])
      .then(([summaryData, addressList, paymentList]) => {
        setSummary(summaryData);
        setAddresses(addressList);
        setPaymentMethods(paymentList);
        setSelectedAddressId((addressList.find((a) => a.is_default) ?? addressList[0])?.id ?? null);
        setSelectedPaymentMethodId((paymentList.find((p) => p.is_default) ?? paymentList[0])?.id ?? null);
        setShowAddressForm(addressList.length === 0);
        setShowPaymentForm(paymentList.length === 0);
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAddress = async (event) => {
    event.preventDefault();
    try {
      const created = await createAddress(addressForm);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setAddressForm(emptyAddressForm);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleAddPaymentMethod = async (event) => {
    event.preventDefault();
    try {
      const payload = paymentType === "upi"
        ? { method_type: "upi", vpa }
        : { method_type: "card", card_number: cardNumber, card_holder_name: cardHolderName };
      const created = await createPaymentMethod(payload);
      setPaymentMethods((prev) => [...prev, created]);
      setSelectedPaymentMethodId(created.id);
      setShowPaymentForm(false);
      setVpa("");
      setCardNumber("");
      setCardHolderName("");
    } catch (err) {
      showError(err.message);
    }
  };

  const handlePay = async () => {
    if (!window.Razorpay) {
      showError(RAZORPAY_UNAVAILABLE);
      return;
    }

    setPaying(true);

    let orderData;
    try {
      orderData = await createRazorpayOrder({ addressId: selectedAddressId, buyNow });
    } catch (err) {
      showError(err.message);
      setPaying(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: orderData.razorpay_key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: en.MAIN_LAYOUT.APP_NAME,
      order_id: orderData.razorpay_order_id,
      theme: { color: "#6366f1" },
      modal: {
        ondismiss: () => setPaying(false),
      },
      handler: async (response) => {
        try {
          const order = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            addressId: selectedAddressId,
            paymentMethodId: selectedPaymentMethodId,
            buyNow,
          });
          if (!buyNow) {
            dispatch(setCartCount(0));
          }
          showSuccess(SUCCESS_MESSAGE);
          navigate(ROUTES.ORDERS, { state: { newOrderId: order.id } });
        } catch (err) {
          showError(err.message);
        } finally {
          setPaying(false);
        }
      },
    });

    razorpay.on("payment.failed", (response) => {
      showError(response.error?.description || RAZORPAY_UNAVAILABLE);
      setPaying(false);
    });

    razorpay.open();
  };

  if (loading) {
    return <div className="checkout-page-body"><p>{LOADING}</p></div>;
  }

  const canPay = Boolean(selectedAddressId) && summary?.items?.length > 0;

  return (
    <div className="checkout-page-body">
      <PageHeader kicker={KICKER} title={TITLE} />

      <section className="checkout-page-panel">
        <h2>{ADDRESS_TITLE}</h2>
        {addresses.length === 0 && !showAddressForm && <p>{NO_ADDRESS}</p>}

        <div className="checkout-page-options">
          {addresses.map((address) => (
            <label className="checkout-page-option" key={address.id}>
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === address.id}
                onChange={() => setSelectedAddressId(address.id)}
              />
              <span>
                {address.full_name}, {address.line1}, {address.city}, {address.state} {address.postal_code}
              </span>
            </label>
          ))}
        </div>

        {showAddressForm ? (
          <form className="checkout-page-form" onSubmit={handleAddAddress}>
            <input placeholder={ADDRESS_FORM.FULL_NAME} value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} required />
            <input placeholder={ADDRESS_FORM.PHONE} value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required />
            <input placeholder={ADDRESS_FORM.LINE1} value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} required />
            <input placeholder={ADDRESS_FORM.LINE2} value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} />
            <input placeholder={ADDRESS_FORM.CITY} value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required />
            <input placeholder={ADDRESS_FORM.STATE} value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required />
            <input placeholder={ADDRESS_FORM.POSTAL_CODE} value={addressForm.postal_code} onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })} required />
            <input placeholder={ADDRESS_FORM.COUNTRY} value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} />
            <div className="checkout-page-form-actions">
              <button type="submit">{ADDRESS_FORM.SAVE_BUTTON}</button>
              {addresses.length > 0 && (
                <button type="button" onClick={() => setShowAddressForm(false)}>{CANCEL}</button>
              )}
            </div>
          </form>
        ) : (
          <button type="button" className="checkout-page-add-btn" onClick={() => setShowAddressForm(true)}>
            {ADD_ADDRESS_BUTTON}
          </button>
        )}
      </section>

      <section className="checkout-page-panel">
        <h2>{PAYMENT_TITLE}</h2>
        <p className="checkout-page-note">{PAYMENT_NOTE}</p>
        {paymentMethods.length === 0 && !showPaymentForm && <p>{NO_PAYMENT}</p>}

        <div className="checkout-page-options">
          {paymentMethods.map((method) => (
            <label className="checkout-page-option" key={method.id}>
              <input
                type="radio"
                name="payment-method"
                checked={selectedPaymentMethodId === method.id}
                onChange={() => setSelectedPaymentMethodId(method.id)}
              />
              <span>{method.display_label}</span>
            </label>
          ))}
        </div>

        {showPaymentForm ? (
          <form className="checkout-page-form" onSubmit={handleAddPaymentMethod}>
            <div className="checkout-page-payment-type">
              <label>
                <input type="radio" checked={paymentType === "upi"} onChange={() => setPaymentType("upi")} />
                {UPI_LABEL}
              </label>
              <label>
                <input type="radio" checked={paymentType === "card"} onChange={() => setPaymentType("card")} />
                {CARD_LABEL}
              </label>
            </div>
            {paymentType === "upi" ? (
              <input placeholder={UPI_VPA_PLACEHOLDER} value={vpa} onChange={(e) => setVpa(e.target.value)} required />
            ) : (
              <>
                <input placeholder={CARD_NUMBER_PLACEHOLDER} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                <input placeholder={CARD_HOLDER_PLACEHOLDER} value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} required />
              </>
            )}
            <div className="checkout-page-form-actions">
              <button type="submit">{SAVE}</button>
              {paymentMethods.length > 0 && (
                <button type="button" onClick={() => setShowPaymentForm(false)}>{CANCEL}</button>
              )}
            </div>
          </form>
        ) : (
          <button type="button" className="checkout-page-add-btn" onClick={() => setShowPaymentForm(true)}>
            {ADD_PAYMENT_BUTTON}
          </button>
        )}
      </section>

      <section className="checkout-page-panel">
        <h2>{ORDER_SUMMARY_TITLE}</h2>
        <div className="checkout-page-summary-items">
          {summary?.items?.map((item) => (
            <div key={item.product_id} className="checkout-page-summary-row">
              <span>{item.name} × {item.quantity}</span>
              <span>${Number(item.line_total).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="checkout-page-total">
          <span>{TOTAL_LABEL}</span>
          <strong>${Number(summary?.total_amount ?? 0).toFixed(2)}</strong>
        </div>
      </section>

      <button type="button" className="checkout-page-pay-btn" disabled={!canPay || paying} onClick={handlePay}>
        {paying ? PAYING_BUTTON : PAY_BUTTON}
      </button>
    </div>
  );
};

export default Checkout;
