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
    REGISTER: { SUCCESS_MESSAGE, ERROR_FALLBACK, ...strings },
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
      <h2>{strings.TITLE}</h2>

      <FormInput
        type={strings.NAME_TYPE}
        name={strings.NAME_NAME}
        placeholder={strings.NAME_PLACEHOLDER}
        value={name}
        onChange={handleChange}
        touched={touchedName}
        error={errorName}
      />

      <FormInput
        type={strings.EMAIL_TYPE}
        name={strings.EMAIL_NAME}
        placeholder={strings.EMAIL_PLACEHOLDER}
        value={email}
        onChange={handleChange}
        touched={touchedEmail}
        error={errorEmail}
      />

      <FormInput
        type={strings.PASSWORD_TYPE}
        name={strings.PASSWORD_NAME}
        placeholder={strings.PASSWORD_PLACEHOLDER}
        value={password}
        onChange={handleChange}
        touched={touchedPassword}
        error={errorPassword}
      />

      <FormInput
        type={strings.CONFIRM_PASSWORD_TYPE}
        name={strings.CONFIRM_PASSWORD_NAME}
        placeholder={strings.CONFIRM_PASSWORD_PLACEHOLDER}
        value={confirmPassword}
        onChange={handleChange}
        touched={touchedConfirm}
        error={errorConfirm}
      />

      <FormButton
        type={strings.SUBMIT_TYPE}
        disabled={loading}
        loading={loading}
        label={strings.SUBMIT_BUTTON}
        loadingLabel={strings.LOADING_BUTTON}
      />

      <p>
        {strings.REDIRECT_TEXT}{" "}
        <Link to={LOGIN}>{strings.REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
