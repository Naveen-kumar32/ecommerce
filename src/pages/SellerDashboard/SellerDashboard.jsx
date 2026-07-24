// Third-party
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Components
import { ProductManager } from "../../components";

// API
import { getMySellerProfile } from "../../api/sellerApi";

// Store
import { selectUsername } from "../../store/authSlice";

// Constants / Locales
import en from "../../locales/en";

// Utils
import { showError } from "../../utils/errorToast";

const SellerDashboard = () => {
  const username = useSelector(selectUsername);
  const [storeName, setStoreName] = useState(null);
  const {
    SELLER_DASHBOARD: { KICKER, SUBTITLE, WELCOME },
  } = en;

  useEffect(() => {
    getMySellerProfile()
      .then((profile) => setStoreName(profile.store_name))
      .catch((err) => showError(err.message));
  }, []);

  const title = storeName ?? `${WELCOME}${username ? `, ${username}` : ""}`;

  return <ProductManager kicker={KICKER} title={title} subtitle={SUBTITLE} />;
};

export default SellerDashboard;
