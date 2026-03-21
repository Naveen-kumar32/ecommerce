import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .matches(
      /[A-Z]/,
      "Must contain at least one uppercase letter"
    )
    .matches(
      /[a-z]/,
      "Must contain at least one lowercase letter"
    )
    .matches(/\d/, "Must contain a number")
    .matches(
      /[@$!%*?&]/,
      "Must contain a special character"
    )
    .required("Password is required"),
});