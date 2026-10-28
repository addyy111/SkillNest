import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter admin email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE}/users/login`,
        {
          email: email.trim(),
          password: password
        }
      );

      const user = response.data;

      if (!user) {
        setError("Invalid admin email or password.");
        return;
      }

      if (user.role !== "ADMIN") {
        setError("Access denied: This account does not have administrator privileges.");
        return;
      }

      localStorage.setItem(
        "skillnestUser",
        JSON.stringify(user)
      );

      navigate("/admin");

    } catch (err) {
      console.error("Admin login error:", err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid admin email or password.";
      setError(serverMessage);
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
            <span className="auth-label">ADMIN PORTAL</span>
            <h1>Admin Login</h1>
            <p>Sign in with administrator credentials to manage SkillNest.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {/* LOGIN FORM */}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                placeholder="admin@skillnest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Verifying Credentials..." : "Admin Sign In →"}
            </button>
          </form>

          {/* LOGIN OPTIONS SWITCHER */}
          <div className="login-options">
            <Link to="/login" className="login-option-btn">
              Student Login
            </Link>
            <Link to="/admin/login" className="login-option-btn active">
              Admin Login
            </Link>
          </div>
        </div>

        <Link to="/" className="auth-back">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export default AdminLogin;