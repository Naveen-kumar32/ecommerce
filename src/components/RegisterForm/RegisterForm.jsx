// Third-party
import { useFormik } from "formik";
import { Link } from "react-router-dom";

// Components
import FormInput from "../FormInput/FormInput";
import FormButton from "../FormButton/FormButton";

// Validators
import { createRegisterSchema } from "../../validators/registerSchema";

// Constants / Locales
import en from "../../locales/en";

const RegisterForm = ({ onSubmit, loading, strings }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: createRegisterSchema(en.VALIDATION),
    onSubmit: (values) => {
      onSubmit(values);
    },
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
        <Link to={en.ROUTES.LOGIN}>{strings.REDIRECT_LINK}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
