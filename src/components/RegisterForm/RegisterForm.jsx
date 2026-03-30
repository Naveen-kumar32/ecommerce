// Third-party
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";

// Components
import FormInput from "../FormInput/FormInput";
import FormButton from "../FormButton/FormButton";

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

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await registerApi(values);
      showSuccess(en.REGISTER.SUCCESS_MESSAGE);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1000);
    } catch (err) {
      showError(err?.message ?? en.REGISTER.ERROR_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  const strings = en.REGISTER;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: createRegisterSchema(en.VALIDATION),
    onSubmit: handleRegister,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>{strings.TITLE}</h2>

      <FormInput
        type={strings.NAME_TYPE}
        name={strings.NAME_NAME}
        placeholder={strings.NAME_PLACEHOLDER}
        value={formik.values.name}
        onChange={formik.handleChange}
        touched={formik.touched.name}
        error={formik.errors.name}
      />

      <FormInput
        type={strings.EMAIL_TYPE}
        name={strings.EMAIL_NAME}
        placeholder={strings.EMAIL_PLACEHOLDER}
        value={formik.values.email}
        onChange={formik.handleChange}
        touched={formik.touched.email}
        error={formik.errors.email}
      />

      <FormInput
        type={strings.PASSWORD_TYPE}
        name={strings.PASSWORD_NAME}
        placeholder={strings.PASSWORD_PLACEHOLDER}
        value={formik.values.password}
        onChange={formik.handleChange}
        touched={formik.touched.password}
        error={formik.errors.password}
      />

      <FormInput
        type={strings.CONFIRM_PASSWORD_TYPE}
        name={strings.CONFIRM_PASSWORD_NAME}
        placeholder={strings.CONFIRM_PASSWORD_PLACEHOLDER}
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        touched={formik.touched.confirmPassword}
        error={formik.errors.confirmPassword}
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
        <Link to={ROUTES.LOGIN}>{strings.REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
