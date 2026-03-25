// Third-party
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import RegisterForm from "../../components/RegisterForm/RegisterForm";

// API
import { registerApi } from "../../api/authApi";

// Utils
import { showSuccess } from "../../utils/successToast";
import { showError } from "../../utils/errorToast";

// Constants / Locales
import en from "../../locales/en";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setLoading(true);

    try {
      await registerApi(data);

      showSuccess(en.REGISTER.SUCCESS_MESSAGE);

      setTimeout(() => {
        navigate(en.ROUTES.LOGIN);
      }, 1000);
    } catch (err) {
      showError(err?.message ?? en.REGISTER.ERROR_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  return <RegisterForm onSubmit={handleRegister} loading={loading} strings={en.REGISTER} />;
};

export default Register;
