import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      console.log("Login successful:", response.data);

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );

        navigate("/dashboard");
      } else {
        setError(
          "Login successful, but no authentication token was received."
        );
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Branding */}

        <div className="auth-brand">

          <div className="auth-logo">
            PrepPilot
          </div>

          <p>
            Your personal interview preparation
            platform.
          </p>

        </div>

        {/* Login Card */}

        <div className="auth-card">

          <div className="auth-header">

            <h1>Welcome Back</h1>

            <p>
              Sign in to continue your preparation.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="auth-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>

            {/* Password */}

            <div className="auth-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

            </div>

            {/* Error */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          {/* Register */}

          <div className="auth-footer">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

        <p className="auth-bottom-text">
          Practice smarter. Prepare better.
        </p>

      </div>

    </div>
  );
}

export default Login;