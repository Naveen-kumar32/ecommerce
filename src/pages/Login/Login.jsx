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

  const {
    LOGIN: { SUCCESS_MESSAGE, ERROR_FALLBACK, ...LOGIN_STRINGS },
  } = en;

  const { DASHBOARD } = ROUTES;

  const handleLogin = async (data) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await loginApi(data);

      if (response?.status === 200 || response) {
        showSuccess(SUCCESS_MESSAGE);
        navigate(DASHBOARD);
      } else {
        showError(ERROR_FALLBACK);
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ??
        err?.message ??
        ERROR_FALLBACK;

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} strings={LOGIN_STRINGS} />;
};

export default Login;