import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { loginApi } from "../api/authApi";
import { showSuccess, showError } from "../utils/toast";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setLoading(true);

    try {
      await loginApi(data);

      showSuccess("Login successful 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      showError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} />;
};

export default Login;