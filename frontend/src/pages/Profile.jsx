import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("skillnestUser")
  );

  const [user, setUser] = useState(
    savedUser || {
      name: "SkillNest Student",
      email: "student@example.com",
      role: "Student"
    }
  );

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user.name);


  const handleSave = () => {

    const updatedUser = {
      ...user,
      name: name
    };

    setUser(updatedUser);

    localStorage.setItem(
      "skillnestUser",
      JSON.stringify(updatedUser)
    );

    setEditing(false);

  };


  const handleLogout = () => {

    localStorage.removeItem("skillnestUser");

    navigate("/");

  };


  return (

    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <div>

          <p className="profile-label">
            MY PROFILE
          </p>

          <h1>
            Profile
          </h1>

          <p>
            Manage your SkillNest account and view your progress.
          </p>

        </div>

        <Link
          to="/dashboard"
          className="profile-back-btn"
        >
          ← Dashboard
        </Link>

      </div>


      {/* PROFILE MAIN GRID */}

      <div className="profile-grid">

        {/* PROFILE CARD */}

        <section className="profile-card">

          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>


          {!editing ? (

            <>

              <h2>
                {user.name}
              </h2>

              <p className="profile-email">
                {user.email}
              </p>

              <span className="profile-role">
                {user.role}
              </span>

              <button
                className="profile-edit-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>

            </>

          ) : (

            <div className="profile-edit-form">

              <label>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <div className="profile-edit-actions">

                <button
                  className="profile-cancel-btn"
                  onClick={() => {
                    setName(user.name);
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="profile-save-btn"
                  onClick={handleSave}
                >
                  Save
                </button>

              </div>

            </div>

          )}

        </section>


        {/* ACCOUNT INFORMATION */}

        <section className="profile-info-card">

          <p className="profile-label">
            ACCOUNT
          </p>

          <h2>
            Account Information
          </h2>


          <div className="account-info-list">

            <div className="account-info-item">

              <span>
                Full Name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>


            <div className="account-info-item">

              <span>
                Email
              </span>

              <strong>
                {user.email}
              </strong>

            </div>


            <div className="account-info-item">

              <span>
                Account Type
              </span>

              <strong>
                {user.role}
              </strong>

            </div>


            <div className="account-info-item">

              <span>
                Member Since
              </span>

              <strong>
                September 2026
              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* STATISTICS */}

      <section className="profile-section">

        <div className="profile-section-header">

          <div>

            <p className="profile-label">
              PERFORMANCE
            </p>

            <h2>
              Your Statistics
            </h2>

          </div>

        </div>


        <div className="profile-stats">

          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              📚
            </div>

            <h3>
              84
            </h3>

            <p>
              Questions Solved
            </p>

          </div>


          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              🎯
            </div>

            <h3>
              68%
            </h3>

            <p>
              Average Accuracy
            </p>

          </div>


          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              📝
            </div>

            <h3>
              12
            </h3>

            <p>
              Quizzes Completed
            </p>

          </div>


          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              🔥
            </div>

            <h3>
              7
            </h3>

            <p>
              Day Streak
            </p>

          </div>

        </div>

      </section>


      {/* SKILLS */}

      <section className="profile-section">

        <div className="profile-section-header">

          <div>

            <p className="profile-label">
              SKILLS
            </p>

            <h2>
              Your Skills
            </h2>

          </div>

          <Link to="/questions">
            Practice More →
          </Link>

        </div>


        <div className="profile-skills">

          <div className="profile-skill">

            <div className="profile-skill-top">

              <strong>
                Java
              </strong>

              <span>
                75%
              </span>

            </div>

            <div className="profile-progress">
              <div
                style={{ width: "75%" }}
              ></div>
            </div>

          </div>


          <div className="profile-skill">

            <div className="profile-skill-top">

              <strong>
                React
              </strong>

              <span>
                60%
              </span>

            </div>

            <div className="profile-progress">
              <div
                style={{ width: "60%" }}
              ></div>
            </div>

          </div>


          <div className="profile-skill">

            <div className="profile-skill-top">

              <strong>
                JavaScript
              </strong>

              <span>
                55%
              </span>

            </div>

            <div className="profile-progress">
              <div
                style={{ width: "55%" }}
              ></div>
            </div>

          </div>


          <div className="profile-skill">

            <div className="profile-skill-top">

              <strong>
                SQL
              </strong>

              <span>
                45%
              </span>

            </div>

            <div className="profile-progress">
              <div
                style={{ width: "45%" }}
              ></div>
            </div>

          </div>

        </div>

      </section>


      {/* ACCOUNT ACTIONS */}

      <section className="profile-danger-section">

        <div>

          <p className="profile-label">
            ACCOUNT ACTIONS
          </p>

          <h2>
            Sign out of SkillNest
          </h2>

          <p>
            You can sign back in anytime to continue your preparation.
          </p>

        </div>


        <button
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </section>

    </div>

  );
}

export default Profile;