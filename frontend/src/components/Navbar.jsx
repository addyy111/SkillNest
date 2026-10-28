import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("skillnestUser")
  );

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("skillnestUser");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link to="/" className="logo">

        <span className="logo-icon">
          S
        </span>

        <span>
          SkillNest
        </span>

      </Link>


      {/* NAVIGATION */}

      <div className="nav-links">

        {isAdmin ? (

          /* =========================
             ADMIN NAVIGATION
          ========================== */

          <>
            <Link to="/admin">
              Dashboard
            </Link>

            <Link to="/admin/questions">
              Questions
            </Link>

            <Link to="/admin/quizzes">
              Manage Tests
            </Link>

            <Link to="/admin/users">
              Users
            </Link>
          </>

        ) : (

          /* =========================
             STUDENT NAVIGATION
          ========================== */

          <>
            <Link to="/">
              Home
            </Link>

            <Link to="/questions">
              Practice
            </Link>

            <Link to="/take-test">
              Take Test
            </Link>

            <Link to="/dashboard">
              Progress
            </Link>

            {user && (
              <>
                <Link to="/bookmarks">
                  Bookmarks
                </Link>

                <Link to="/leaderboard">
                  Leaderboard
                </Link>
              </>
            )}
          </>

        )}

      </div>


      {/* ACTIONS */}

      <div className="nav-actions">

        {user ? (

          <>

            {/* USER */}

            <Link
              to={isAdmin ? "/admin" : "/profile"}
              className="nav-user"
            >

              <span className="nav-avatar">

                {user.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "S"}

              </span>

              <span className="nav-user-name">
                {user.name}
              </span>

            </Link>


            {/* LOGOUT */}

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        ) : (

          <>

            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="signup-btn"
            >
              Get Started
            </Link>

          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;