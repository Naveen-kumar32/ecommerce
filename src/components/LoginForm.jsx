import { useFormik } from "formik";
import { loginSchema } from "../validators/loginSchema";

const LoginForm = ({ onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Login</h2>

      <input
        type="text"
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
      />
      {formik.touched.email && formik.errors.email && (
        <p style={{ color: "red" }}>{formik.errors.email}</p>
      )}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      {formik.touched.password && formik.errors.password && (
        <p style={{ color: "red" }}>{formik.errors.password}</p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Logging..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;