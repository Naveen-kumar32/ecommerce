// Third-party
import axios from "axios";

// Store
import { store } from "../store";
import { clearCredentials, selectAuthToken } from "../store/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = selectAuthToken(store.getState());

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearCredentials());
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
