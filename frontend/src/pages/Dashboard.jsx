import { Link } from "react-router-dom";

function Dashboard() {

  const skills = [
    {
      name: "Java",
      topic: "Object Oriented Programming",
      progress: 75,
      questions: 32
    },
    {
      name: "React",
      topic: "Components & Hooks",
      progress: 60,
      questions: 24
    },
    {
      name: "JavaScript",
      topic: "ES6 & DOM",
      progress: 55,
      questions: 28
    },
    {
      name: "SQL",
      topic: "Queries & Database",
      progress: 45,
      questions: 20
    }
  ];

  const activities = [
    {
      title: "Java Fundamentals Quiz",
      result: "16 / 20",
      time: "Today"
    },
    {
      title: "React Basics Quiz",
      result: "12 / 15",
      time: "Yesterday"
    },
    {
      title: "JavaScript Practice",
      result: "8 / 10",
      time: "2 days ago"
    }
  ];


  return (

    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-welcome">

        <div>

          <p className="dashboard-label">
            STUDENT DASHBOARD
          </p>

          <h1>
            Welcome back 👋
          </h1>

          <p>
            Keep practicing and improve your technical skills.
          </p>

        </div>

        <Link
          to="/questions"
          className="dashboard-practice-btn"
        >
          Start Practicing →
        </Link>

      </div>


      {/* STAT CARDS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            📚
          </div>

          <div>
            <h2>84</h2>
            <p>Questions Solved</p>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            🎯
          </div>

          <div>
            <h2>68%</h2>
            <p>Average Accuracy</p>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            📝
          </div>

          <div>
            <h2>12</h2>
            <p>Tests Completed</p>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="dashboard-stat-icon">
            🔥
          </div>

          <div>
            <h2>7 Days</h2>
            <p>Current Streak</p>
          </div>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">


        {/* SKILLS */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <p className="dashboard-label">
                YOUR PROGRESS
              </p>

              <h2>
                Continue Practicing
              </h2>

            </div>

            <Link to="/questions">
              View All →
            </Link>

          </div>


          <div className="skill-list">

            {skills.map((skill) => (

              <Link
                key={skill.name}
                to={`/questions/${skill.name.toLowerCase()}`}
                className="skill-progress-card"
              >

                <div className="skill-icon">
                  {skill.name.charAt(0)}
                </div>


                <div className="skill-details">

                  <div className="skill-title">

                    <div>

                      <h3>
                        {skill.name}
                      </h3>

                      <p>
                        {skill.topic}
                      </p>

                    </div>

                    <strong>
                      {skill.progress}%
                    </strong>

                  </div>


                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>

                  </div>


                  <small>
                    {skill.questions} questions practiced
                  </small>

                </div>


                <span className="skill-arrow">
                  →
                </span>

              </Link>

            ))}

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-section quick-section">

          <p className="dashboard-label">
            QUICK ACTIONS
          </p>

          <h2>
            What do you want to do?
          </h2>


          <div className="quick-actions">

            <Link
              to="/questions"
              className="quick-action"
            >

              <span>
                💻
              </span>

              <div>
                <h3>
                  Practice Questions
                </h3>

                <p>
                  Improve your concepts
                </p>
              </div>

              <b>
                →
              </b>

            </Link>


            <Link
              to="/take-test"
              className="quick-action"
            >

              <span>
                📝
              </span>

              <div>
                <h3>
                  Take Test
                </h3>

                <p>
                  Test your knowledge
                </p>
              </div>

              <b>
                →
              </b>

            </Link>


            <Link
              to="/profile"
              className="quick-action"
            >

              <span>
                👤
              </span>

              <div>
                <h3>
                  View Profile
                </h3>

                <p>
                  Manage your account
                </p>
              </div>

              <b>
                →
              </b>

            </Link>

          </div>

        </section>

      </div>


      {/* RECENT ACTIVITY */}

      <section className="dashboard-section recent-section">

        <div className="dashboard-section-header">

          <div>

            <p className="dashboard-label">
              ACTIVITY
            </p>

            <h2>
              Recent Activity
            </h2>

          </div>

        </div>


        <div className="activity-list">

          {activities.map((activity, index) => (

            <div
              className="activity-item"
              key={index}
            >

              <div className="activity-icon">
                ✓
              </div>

              <div className="activity-info">

                <h3>
                  {activity.title}
                </h3>

                <p>
                  Completed {activity.time}
                </p>

              </div>

              <strong className="activity-result">
                {activity.result}
              </strong>

            </div>

          ))}

        </div>

      </section>


      {/* CTA */}

      <section className="dashboard-cta">

        <div>

          <p className="dashboard-label">
            KEEP GOING
          </p>

          <h2>
            Ready for your next challenge?
          </h2>

          <p>
            Practice more questions and improve your interview preparation.
          </p>

        </div>

        <Link
          to="/take-test"
          className="dashboard-practice-btn"
        >
          Take Test →
        </Link>

      </section>

    </div>

  );
}

export default Dashboard;