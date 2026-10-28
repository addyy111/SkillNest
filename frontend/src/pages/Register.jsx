import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE}/users/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        }
      );

      const registeredUser = response.data;

      localStorage.setItem(
        "skillnestUser",
        JSON.stringify(registeredUser)
      );

      navigate("/dashboard");

    } catch (err) {
      console.error("Registration error:", err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      setError(
        serverMessage ||
        "Registration failed. Please verify that the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LOGO */}
        <Link to="/" className="auth-logo">
          <span className="logo-icon">S</span>
          <span>SkillNest</span>
        </Link>

        {/* CARD */}
        <div className="auth-card">
          <div className="auth-header">
            <p className="dashboard-label">GET STARTED</p>
            <h1>Create your account</h1>
            <p>Start preparing for your technical interviews.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleRegister}>
            {/* NAME */}
            <div className="auth-form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="auth-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="auth-form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="auth-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>
        </div>

        <Link to="/" className="auth-back">
          ← Back to SkillNest
        </Link>
      </div>
    </div>
  );
}

export default Register;