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

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    REGISTER: {
      SUCCESS_MESSAGE,
      ERROR_FALLBACK,
      TITLE,
      NAME_TYPE,
      NAME_NAME,
      NAME_PLACEHOLDER,
      EMAIL_TYPE,
      EMAIL_NAME,
      EMAIL_PLACEHOLDER,
      PASSWORD_TYPE,
      PASSWORD_NAME,
      PASSWORD_PLACEHOLDER,
      CONFIRM_PASSWORD_TYPE,
      CONFIRM_PASSWORD_NAME,
      CONFIRM_PASSWORD_PLACEHOLDER,
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

      if (response?.status === 201 || response) {
        showSuccess(SUCCESS_MESSAGE);
        navigate(LOGIN);
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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: createRegisterSchema(VALIDATION),
    onSubmit: handleRegister,
  });

  const {
    values: { name, email, password, confirmPassword },
    touched: { name: touchedName, email: touchedEmail, password: touchedPassword, confirmPassword: touchedConfirm },
    errors: { name: errorName, email: errorEmail, password: errorPassword, confirmPassword: errorConfirm },
    handleChange,
    handleSubmit,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{TITLE}</h2>

      <FormInput
        type={NAME_TYPE}
        name={NAME_NAME}
        placeholder={NAME_PLACEHOLDER}
        value={name}
        onChange={handleChange}
        touched={touchedName}
        error={errorName}
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

      <FormInput
        type={CONFIRM_PASSWORD_TYPE}
        name={CONFIRM_PASSWORD_NAME}
        placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
        value={confirmPassword}
        onChange={handleChange}
        touched={touchedConfirm}
        error={errorConfirm}
      />

      <FormButton
        type={SUBMIT_TYPE}
        disabled={loading}
        loading={loading}
        label={SUBMIT_BUTTON}
        loadingLabel={LOADING_BUTTON}
      />

      <p>
        {REDIRECT_TEXT}{" "}
        <Link to={LOGIN}>{REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
