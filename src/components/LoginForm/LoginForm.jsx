// Third-party
import { useFormik } from "formik";
import { Link } from "react-router-dom";

// Components
import { FormInput, FormButton } from "../index";

// Constants
import { createUserRoleOptions, USER_ROLES } from "../../constants/userRoles";

// Validators
import { createLoginSchema } from "../../validators/loginSchema";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

const LoginForm = ({ onSubmit, loading, strings }) => {
  const { ROLES, VALIDATION } = en;
  const { REGISTER } = ROUTES;
  const roleOptions = createUserRoleOptions(ROLES);

  const {
    TITLE,
    IDENTIFIER_TYPE,
    IDENTIFIER_NAME,
    IDENTIFIER_PLACEHOLDER,
    PASSWORD_TYPE,
    PASSWORD_NAME,
    PASSWORD_PLACEHOLDER,
    SUBMIT_TYPE,
    ROLE_NAME,
    ROLE_PLACEHOLDER,
    ROLE_TYPE,
    SUBMIT_BUTTON,
    LOADING_BUTTON,
    REDIRECT_TEXT,
    REDIRECT_LINK,
  } = strings;

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
      role: USER_ROLES.CUSTOMER,
    },
    validationSchema: createLoginSchema(VALIDATION),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const {
    values: { identifier, password, role },
    touched: { identifier: touchedIdentifier, password: touchedPassword, role: touchedRole },
    errors: { identifier: errorIdentifier, password: errorPassword, role: errorRole },
    handleBlur,
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
        onBlur={handleBlur}
        onChange={handleChange}
        touched={touchedIdentifier}
        error={errorIdentifier}
      />

      <FormInput
        type={PASSWORD_TYPE}
        name={PASSWORD_NAME}
        placeholder={PASSWORD_PLACEHOLDER}
        value={password}
        onBlur={handleBlur}
        onChange={handleChange}
        touched={touchedPassword}
        error={errorPassword}
      />

      <FormInput
        type={ROLE_TYPE}
        name={ROLE_NAME}
        placeholder={ROLE_PLACEHOLDER}
        value={role}
        onBlur={handleBlur}
        onChange={handleChange}
        options={roleOptions}
        touched={touchedRole}
        error={errorRole}
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
