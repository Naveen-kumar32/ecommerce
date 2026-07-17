// Third-party
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import { LoginForm } from "../../components";

// API
import { loginApi } from "../../api/authApi";

// Store
import { setCredentials } from "../../store/authSlice";

// Utils
import { getDashboardRouteForRole } from "../../utils/authRedirect";
import { showSuccess } from "../../utils/successToast";
import { showError } from "../../utils/errorToast";

// Constants / Locales
import en from "../../locales/en";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    LOGIN: { SUCCESS_MESSAGE, ERROR_FALLBACK, ...LOGIN_STRINGS },
  } = en;

  const handleLogin = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await loginApi(data);

      if (response) {
        dispatch(setCredentials(response));
        showSuccess(SUCCESS_MESSAGE);
        navigate(getDashboardRouteForRole(response.role));
      }
    } catch (err) {
      const errorMessage = err?.message ?? ERROR_FALLBACK;
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} strings={LOGIN_STRINGS} />;
};

export default Login;
