import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

function AdminDashboard() {
  const [stats, setStats] = useState({
    questions: 0,
    quizzes: 0,
    users: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [questionsRes, quizzesRes, usersRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/questions/count`),
          axios.get(`${API_BASE}/quizzes`),
          axios.get(`${API_BASE}/users/count`)
        ]);

        setStats({
          questions: questionsRes.status === "fulfilled" ? questionsRes.value.data : 0,
          quizzes: quizzesRes.status === "fulfilled" ? (Array.isArray(quizzesRes.value.data) ? quizzesRes.value.data.length : 0) : 0,
          users: usersRes.status === "fulfilled" ? usersRes.value.data : 0,
          loading: false
        });
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <p className="admin-label">ADMIN PANEL</p>
          <h1>Admin Dashboard</h1>
          <p>Manage SkillNest questions, quizzes and students.</p>
        </div>

        <Link to="/" className="admin-home-btn">
          ← Back to Website
        </Link>
      </div>

      {/* STATISTICS */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📝</span>
          <div>
            <p>Total Questions</p>
            <h2>{stats.loading ? "..." : stats.questions}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">🎯</span>
          <div>
            <p>Total Tests</p>
            <h2>{stats.loading ? "..." : stats.quizzes}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">👨‍🎓</span>
          <div>
            <p>Registered Users</p>
            <h2>{stats.loading ? "..." : stats.users}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">💡</span>
          <div>
            <p>Skill Categories</p>
            <h2>9</h2>
          </div>
        </div>
      </div>

      {/* MANAGEMENT CARDS */}
      <div className="admin-section">
        <div className="admin-section-title">
          <p className="admin-label">MANAGEMENT</p>
          <h2>Manage SkillNest</h2>
        </div>

        <div className="admin-management-grid">
          {/* QUESTIONS */}
          <Link to="/admin/questions" className="admin-management-card">
            <div className="admin-management-icon">📝</div>
            <h3>Manage Questions</h3>
            <p>
              Add, edit, delete and manage technical practice questions with marks.
            </p>
            <span>Manage Questions →</span>
          </Link>

          {/* TESTS */}
          <Link to="/admin/quizzes" className="admin-management-card">
            <div className="admin-management-icon">🎯</div>
            <h3>Manage Tests</h3>
            <p>
              Create, edit, draft, publish tests, preview questions, and view student attempts.
            </p>
            <span>Manage Tests →</span>
          </Link>

          {/* USERS */}
          <Link to="/admin/users" className="admin-management-card">
            <div className="admin-management-icon">👥</div>
            <h3>Manage Users</h3>
            <p>
              View registered students and manage platform accounts.
            </p>
            <span>Manage Users →</span>
          </Link>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="admin-section">
        <div className="admin-section-title">
          <p className="admin-label">QUICK ACTIONS</p>
          <h2>Common Tasks</h2>
        </div>

        <div className="admin-quick-actions">
          <Link to="/admin/questions">+ Add Question</Link>
          <Link to="/admin/quizzes">+ Create Test</Link>
          <Link to="/admin/users">View Students</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;