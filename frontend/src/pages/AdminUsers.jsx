import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

const API_URL = `${API_BASE}/users`;

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setError("");
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Unable to load registered users from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to delete user."
      );
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();
    const nameMatch = user.name?.toLowerCase().includes(searchText) || false;
    const emailMatch = user.email?.toLowerCase().includes(searchText) || false;
    const matchesSearch = nameMatch || emailMatch;

    const userRole = user.role?.toUpperCase();
    const matchesRole =
      roleFilter === "All" ||
      userRole === roleFilter.toUpperCase();

    return matchesSearch && matchesRole;
  });

  const studentCount = users.filter((u) => u.role?.toUpperCase() === "STUDENT").length;
  const adminCount = users.filter((u) => u.role?.toUpperCase() === "ADMIN").length;

  return (
    <div className="admin-users-page">
      {/* HEADER */}
      <div className="admin-users-header">
        <div>
          <p className="admin-label">USER MANAGEMENT</p>
          <h1>Manage Users</h1>
          <p>View and manage registered SkillNest students and administrators.</p>
        </div>

        <Link to="/admin" className="admin-back-btn">
          ← Admin Dashboard
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-question-error" style={{ marginBottom: "20px" }}>
          <strong>Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {/* USER STATISTICS */}
      <div className="user-admin-stats">
        <div className="user-admin-stat">
          <span className="user-stat-icon">👥</span>
          <div>
            <p>Total Users</p>
            <h2>{users.length}</h2>
          </div>
        </div>

        <div className="user-admin-stat">
          <span className="user-stat-icon">👨‍🎓</span>
          <div>
            <p>Students</p>
            <h2>{studentCount}</h2>
          </div>
        </div>

        <div className="user-admin-stat">
          <span className="user-stat-icon">🛡️</span>
          <div>
            <p>Administrators</p>
            <h2>{adminCount}</h2>
          </div>
        </div>

        <div className="user-admin-stat">
          <span className="user-stat-icon">✓</span>
          <div>
            <p>Active Accounts</p>
            <h2>{users.length}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="user-management-toolbar">
        <div className="user-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* COUNT */}
      <div className="user-result-count">
        <strong>{filteredUsers.length}</strong>
        <span> users found</span>
      </div>

      {/* USERS TABLE */}
      <div className="admin-users-table">
        <div className="admin-users-table-header">
          <span>ID</span>
          <span>USER</span>
          <span>ROLE</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>

        {loading ? (
          <div className="admin-loading" style={{ padding: "30px", textAlign: "center" }}>
            Loading users from database...
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="admin-user-row" key={user.id}>
              <span className="user-id">#{user.id}</span>

              <div className="admin-user-info">
                <div className="admin-user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
              </div>

              <span className="user-role">{user.role}</span>

              <span className="user-status active">Active</span>

              <div className="user-actions">
                <button
                  className="view-user-btn"
                  onClick={() => setSelectedUser(user)}
                >
                  View
                </button>

                <button
                  className="delete-user-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-users">
            <h3>No users found</h3>
            <p>Try changing your search or filter.</p>
          </div>
        )}
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="user-modal-overlay">
          <div className="user-modal-card">
            <button
              className="close-user-modal"
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>

            <div className="user-modal-profile">
              <div className="large-user-avatar">
                {selectedUser.name
                  ? selectedUser.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <h2>{selectedUser.name}</h2>
              <p>{selectedUser.email}</p>

              <span className="modal-role">{selectedUser.role}</span>
            </div>

            <div className="user-detail-grid">
              <div>
                <span>Account ID</span>
                <strong>#{selectedUser.id}</strong>
              </div>

              <div>
                <span>Account Role</span>
                <strong>{selectedUser.role}</strong>
              </div>

              <div>
                <span>Email Verified</span>
                <strong>Yes</strong>
              </div>

              <div>
                <span>Account Status</span>
                <strong>Active</strong>
              </div>
            </div>

            <div className="user-modal-actions">
              <button
                className="modal-close-btn"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>

              <button
                className="modal-delete-btn"
                onClick={() => handleDelete(selectedUser.id)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;