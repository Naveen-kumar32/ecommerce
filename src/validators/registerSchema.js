// Third-party
import * as Yup from "yup";

export const createRegisterSchema = (v) => {
  const {
    NAME_REQUIRED,
    EMAIL_INVALID,
    EMAIL_REQUIRED,
    PASSWORD_MIN,
    PASSWORD_UPPERCASE,
    PASSWORD_LOWERCASE,
    PASSWORD_NUMBER,
    PASSWORD_SPECIAL,
    PASSWORD_REQUIRED,
    CONFIRM_PASSWORD_MATCH,
    CONFIRM_PASSWORD_REQUIRED,
  } = v;

  return Yup.object({
    name: Yup.string()
      .required(NAME_REQUIRED),

    email: Yup.string()
      .email(EMAIL_INVALID)
      .required(EMAIL_REQUIRED),

    password: Yup.string()
      .min(8, PASSWORD_MIN)
      .matches(/[A-Z]/, PASSWORD_UPPERCASE)
      .matches(/[a-z]/, PASSWORD_LOWERCASE)
      .matches(/\d/, PASSWORD_NUMBER)
      .matches(/[@$!%*?&]/, PASSWORD_SPECIAL)
      .required(PASSWORD_REQUIRED),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], CONFIRM_PASSWORD_MATCH)
      .required(CONFIRM_PASSWORD_REQUIRED),
  });
};
