// Third-party
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import { RegisterForm, LoginForm } from "../../components";

// API
import { loginApi } from "../../api/authApi";

// Store
import { setCredentials } from "../../store/authSlice";

// Utils
import { getDashboardRouteForRole } from "../../utils/authRedirect";
import { showError } from "../../utils/errorToast";

// Constants / Locales
import en from "../../locales/en";

const Register = () => {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    LOGIN: { ERROR_FALLBACK, ...LOGIN_STRINGS },
    REGISTER: { SUCCESS_BANNER },
  } = en;

  const handleLogin = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await loginApi(data);

      if (response) {
        dispatch(setCredentials(response));
        navigate(getDashboardRouteForRole(response.role));
      }
    } catch (err) {
      const errorMessage = err?.message ?? ERROR_FALLBACK;
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <>
        <p className="auth-success-banner">
          {SUCCESS_BANNER}
        </p>
        <LoginForm onSubmit={handleLogin} loading={loading} strings={LOGIN_STRINGS} />
      </>
    );
  }

  return <RegisterForm onSuccess={() => setRegistered(true)} />;
};

export default Register;
