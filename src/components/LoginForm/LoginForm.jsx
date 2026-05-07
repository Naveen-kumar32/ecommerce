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
    IDENTIFIER_TYPE,
    IDENTIFIER_NAME,
    IDENTIFIER_PLACEHOLDER,
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
      identifier: "",
      password: "",
    },
    validationSchema: createLoginSchema(VALIDATION),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const {
    values: { identifier, password },
    touched: { identifier: touchedIdentifier, password: touchedPassword },
    errors: { identifier: errorIdentifier, password: errorPassword },
    handleChange,
    handleSubmit,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      {TITLE && <h2 className="auth-title">{TITLE}</h2>}

      <FormInput
        type={IDENTIFIER_TYPE}
        name={IDENTIFIER_NAME}
        placeholder={IDENTIFIER_PLACEHOLDER}
        value={identifier}
        onChange={handleChange}
        touched={touchedIdentifier}
        error={errorIdentifier}
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
        <Link to={REGISTER}>{REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default LoginForm;
