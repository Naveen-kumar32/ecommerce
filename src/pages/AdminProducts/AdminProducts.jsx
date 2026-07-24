// Components
import { ProductManager } from "../../components";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

const AdminProducts = () => {
  const {
    ADMIN_PRODUCTS: { KICKER, SUBTITLE, TITLE },
  } = en;

  return (
    <ProductManager
      kicker={KICKER}
      title={TITLE}
      subtitle={SUBTITLE}
      backLinkTo={ROUTES.ADMIN_DASHBOARD}
    />
  );
};

export default AdminProducts;
