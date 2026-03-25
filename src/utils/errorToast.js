import { toast } from "react-toastify";

export const showError = (message) => {
  toast.error(message);
};
