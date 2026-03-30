// Third-party
import { useFormik } from "formik";
import { Link } from "react-router-dom";

// Components
import FormInput from "../FormInput/FormInput";
import FormButton from "../FormButton/FormButton";

// Validators
import { createLoginSchema } from "../../validators/loginSchema";

// Constants / Locales
import en from "../../locales/en";
import ROUTES from "../../locales/routes";

const LoginForm = ({ onSubmit, loading, strings }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: createLoginSchema(en.VALIDATION),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>{strings.TITLE}</h2>

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

      <FormButton
        type={strings.SUBMIT_TYPE}
        disabled={loading}
        loading={loading}
        label={strings.SUBMIT_BUTTON}
        loadingLabel={strings.LOADING_BUTTON}
      />

      <p>
        {strings.REDIRECT_TEXT}{" "}
        <Link to={ROUTES.REGISTER}>{strings.REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default LoginForm;