// Third-party
import * as Yup from "yup";

export const createRegisterSchema = (v) => {
  const {
    USERNAME_REQUIRED,
    EMAIL_INVALID,
    EMAIL_REQUIRED,
    PASSWORD_MIN,
    PASSWORD_UPPERCASE,
    PASSWORD_LOWERCASE,
    PASSWORD_NUMBER,
    PASSWORD_SPECIAL,
    PASSWORD_REQUIRED,
    ROLE_REQUIRED,
  } = v;

  return Yup.object({
    username: Yup.string().required(USERNAME_REQUIRED),

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

    role: Yup.string().required(ROLE_REQUIRED),
  });
};
