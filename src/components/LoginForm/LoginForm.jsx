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
      <h2>{strings.TITLE}</h2>

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

      <FormButton
        type={strings.SUBMIT_TYPE}
        disabled={loading}
        loading={loading}
        label={strings.SUBMIT_BUTTON}
        loadingLabel={strings.LOADING_BUTTON}
      />

      <p>
        {strings.REDIRECT_TEXT}{" "}
        <Link to={REGISTER}>{strings.REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default LoginForm;