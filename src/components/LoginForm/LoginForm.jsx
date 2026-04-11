// Third-party
import { useFormik } from "formik";
import { Link } from "react-router-dom";

// Components
import { FormInput, FormButton } from "../index";

// Validators
import { createLoginSchema } from "../../validators/loginSchema";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

const LoginForm = ({ onSubmit, loading, strings }) => {
  const { VALIDATION } = en;
  const { REGISTER } = ROUTES;

  const {
    TITLE,
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
  } = strings;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: createLoginSchema(VALIDATION),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const {
    values: { email, password },
    touched: { email: touchedEmail, password: touchedPassword },
    errors: { email: errorEmail, password: errorPassword },
    handleChange,
    handleSubmit,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{TITLE}</h2>

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

      <p>
        {REDIRECT_TEXT}{" "}
        <Link to={REGISTER}>{REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default LoginForm;