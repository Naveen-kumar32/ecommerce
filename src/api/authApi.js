// Constants / Locales
import en from "../locales/en";

export const loginApi = async ({ email, password }) => {
  const response = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail ?? en.LOGIN.ERROR_FALLBACK);
  }

  return data;
};

export const registerApi = async ({ name, email, password }) => {
  const response = await fetch("http://127.0.0.1:8000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail ?? en.REGISTER.ERROR_FALLBACK);
  }

  return data;
};