// Third-party
import * as Yup from "yup";

export const createRegisterSchema = (v) =>
  Yup.object({
    name: Yup.string()
      .required(v.NAME_REQUIRED),

    email: Yup.string()
      .email(v.EMAIL_INVALID)
      .required(v.EMAIL_REQUIRED),

    password: Yup.string()
      .min(8, v.PASSWORD_MIN)
      .matches(/[A-Z]/, v.PASSWORD_UPPERCASE)
      .matches(/[a-z]/, v.PASSWORD_LOWERCASE)
      .matches(/\d/, v.PASSWORD_NUMBER)
      .matches(/[@$!%*?&]/, v.PASSWORD_SPECIAL)
      .required(v.PASSWORD_REQUIRED),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], v.CONFIRM_PASSWORD_MATCH)
      .required(v.CONFIRM_PASSWORD_REQUIRED),
  });
