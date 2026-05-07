// Third-party
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";

// Components
import { FormInput, FormButton } from "../index";

// API
import { registerApi } from "../../api/authApi";

// Utils
import { showSuccess } from "../../utils/successToast";
import { showError } from "../../utils/errorToast";

// Validators
import { createRegisterSchema } from "../../validators/registerSchema";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

const RegisterForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    REGISTER: {
      SUCCESS_MESSAGE,
      ERROR_FALLBACK,
      TITLE,
      USERNAME_TYPE,
      USERNAME_NAME,
      USERNAME_PLACEHOLDER,
      EMAIL_TYPE,
      EMAIL_NAME,
      EMAIL_PLACEHOLDER,
      PASSWORD_TYPE,
      PASSWORD_NAME,
      PASSWORD_PLACEHOLDER,
      SUBMIT_TYPE,
      SUBMIT_BUTTON,
      LOADING_BUTTON,
      REDIRECT_TEXT,
      REDIRECT_LINK,
    },
    VALIDATION,
  } = en;

  const { LOGIN } = ROUTES;

  const handleRegister = async (values) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await registerApi(values);

      if (response) {
        showSuccess(SUCCESS_MESSAGE);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(LOGIN);
        }
      }
    } catch (err) {
      const errorMessage = err?.message ?? ERROR_FALLBACK;
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: createRegisterSchema(VALIDATION),
    onSubmit: handleRegister,
  });

  const {
    values: { username, email, password },
    touched: { username: touchedUsername, email: touchedEmail, password: touchedPassword },
    errors: { username: errorUsername, email: errorEmail, password: errorPassword },
    handleChange,
    handleSubmit,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      {TITLE && <h2 className="auth-title">{TITLE}</h2>}

      <FormInput
        type={USERNAME_TYPE}
        name={USERNAME_NAME}
        placeholder={USERNAME_PLACEHOLDER}
        value={username}
        onChange={handleChange}
        touched={touchedUsername}
        error={errorUsername}
      />

      <FormInput
        type={EMAIL_TYPE}
        name={EMAIL_NAME}
        placeholder={EMAIL_PLACEHOLDER}
        value={email}
        onChange={handleChange}
        touched={touchedEmail}
        error={errorEmail}
      />

      <FormInput
        type={PASSWORD_TYPE}
        name={PASSWORD_NAME}
        placeholder={PASSWORD_PLACEHOLDER}
        value={password}
        onChange={handleChange}
        touched={touchedPassword}
        error={errorPassword}
      />

      <FormButton
        type={SUBMIT_TYPE}
        disabled={loading}
        loading={loading}
        label={SUBMIT_BUTTON}
        loadingLabel={LOADING_BUTTON}
      />

      <p className="auth-redirect">
        {REDIRECT_TEXT}{" "}
        <Link to={LOGIN}>{REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
