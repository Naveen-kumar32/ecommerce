import * as Yup from "yup";

export const createLoginSchema = (v) => {
  const { IDENTIFIER_REQUIRED, PASSWORD_REQUIRED, PASSWORD_MIN, ROLE_REQUIRED } = v;

  return Yup.object({
    identifier: Yup.string().required(IDENTIFIER_REQUIRED),

    password: Yup.string()
      .min(8, PASSWORD_MIN)
      .required(PASSWORD_REQUIRED),

    role: Yup.string().required(ROLE_REQUIRED),
  });
};
