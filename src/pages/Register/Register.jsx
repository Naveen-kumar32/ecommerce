// Third-party
import { useState } from "react";

// Components
import { RegisterForm, LoginForm } from "../../components";

// API
import { loginApi } from "../../api/authApi";

// Utils
import { showError } from "../../utils/errorToast";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    LOGIN: { SUCCESS_MESSAGE: LOGIN_SUCCESS, ERROR_FALLBACK, ...LOGIN_STRINGS },
  } = en;

  const { DASHBOARD } = ROUTES;

  const handleLogin = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await loginApi(data);

      if (response) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("username", response.username);
        navigate(DASHBOARD);
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
          Account created! Log in below.
        </p>
        <LoginForm onSubmit={handleLogin} loading={loading} strings={LOGIN_STRINGS} />
      </>
    );
  }

  return <RegisterForm onSuccess={() => setRegistered(true)} />;
};

export default Register;
