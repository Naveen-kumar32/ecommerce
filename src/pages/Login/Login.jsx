// Third-party
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { LoginForm } from "../../components";

// API
import { loginApi } from "../../api/authApi";

// Utils
import { showSuccess } from "../../utils/successToast";
import { showError } from "../../utils/errorToast";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setLoading(true);

    try {
      await loginApi(data);

      showSuccess(en.LOGIN.SUCCESS_MESSAGE);

      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1000);
    } catch (err) {
      showError(err?.message ?? en.LOGIN.ERROR_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} strings={en.LOGIN} />;
};

export default Login;