import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE}/users/login`,
        {
          email: email,
          password: password
        }
      );

      const user = response.data;

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      localStorage.setItem(
        "skillnestUser",
        JSON.stringify(user)
      );

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password.");
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
            <span className="auth-label">STUDENT PORTAL</span>
            <h1>Student Login</h1>
            <p>Continue your technical interview preparation journey.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {/* LOGIN FORM */}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
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
              {loading ? "Signing in..." : "Student Sign In →"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>
          </div>

          {/* LOGIN TYPE OPTIONS */}
          <div className="login-options">
            <Link to="/login" className="login-option-btn active">
              Student Login
            </Link>
            <Link to="/admin/login" className="login-option-btn">
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

export default Login;