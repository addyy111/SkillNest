import { Link } from "react-router-dom";

function Leaderboard() {

  const students = [
    {
      rank: 1,
      name: "Rahul Sharma",
      score: 950,
      solved: 142,
      accuracy: 94
    },
    {
      rank: 2,
      name: "Priya Patil",
      score: 920,
      solved: 135,
      accuracy: 91
    },
    {
      rank: 3,
      name: "Amit Kulkarni",
      score: 880,
      solved: 128,
      accuracy: 88
    },
    {
      rank: 4,
      name: "Neha Joshi",
      score: 840,
      solved: 115,
      accuracy: 85
    },
    {
      rank: 5,
      name: "Arjun Mehta",
      score: 810,
      solved: 108,
      accuracy: 82
    },
    {
      rank: 6,
      name: "Sneha Deshmukh",
      score: 780,
      solved: 101,
      accuracy: 80
    },
    {
      rank: 7,
      name: "Vikram Singh",
      score: 745,
      solved: 96,
      accuracy: 77
    }
  ];


  const currentUser =
    JSON.parse(
      localStorage.getItem("skillnestUser")
    ) || {
      name: "SkillNest Student"
    };


  return (

    <div className="leaderboard-page">

      {/* HEADER */}

      <div className="leaderboard-header">

        <div>

          <p className="leaderboard-label">
            COMPETE & IMPROVE
          </p>

          <h1>
            SkillNest Leaderboard
          </h1>

          <p>
            Track your performance and see how you compare with other students.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="leaderboard-back-btn"
        >
          ← Dashboard
        </Link>

      </div>


      {/* TOP THREE */}

      <div className="top-three">

        {students.slice(0, 3).map((student) => (

          <div
            className={`top-student rank-${student.rank}`}
            key={student.rank}
          >

            <div className="top-rank">

              {student.rank === 1
                ? "🥇"
                : student.rank === 2
                ? "🥈"
                : "🥉"}

            </div>


            <div className="top-avatar">

              {student.name
                .charAt(0)
                .toUpperCase()}

            </div>


            <h2>
              {student.name}
            </h2>

            <p>
              {student.solved} questions solved
            </p>

            <strong>
              {student.score}
            </strong>

            <span>
              points
            </span>

          </div>

        ))}

      </div>


      {/* LEADERBOARD TABLE */}

      <section className="leaderboard-card">

        <div className="leaderboard-card-header">

          <div>

            <p className="leaderboard-label">
              RANKINGS
            </p>

            <h2>
              All Students
            </h2>

          </div>

          <span className="leaderboard-period">
            Overall
          </span>

        </div>


        <div className="leaderboard-table">

          {/* TABLE HEADER */}

          <div className="leaderboard-row leaderboard-table-header">

            <span>
              Rank
            </span>

            <span>
              Student
            </span>

            <span>
              Questions
            </span>

            <span>
              Accuracy
            </span>

            <span>
              Score
            </span>

          </div>


          {/* STUDENTS */}

          {students.map((student) => (

            <div
              className="leaderboard-row"
              key={student.rank}
            >

              <span className="student-rank">

                {student.rank <= 3
                  ? (
                    student.rank === 1
                      ? "🥇"
                      : student.rank === 2
                      ? "🥈"
                      : "🥉"
                  )
                  : `#${student.rank}`}

              </span>


              <span className="student-name">

                <span className="student-small-avatar">

                  {student.name
                    .charAt(0)
                    .toUpperCase()}

                </span>

                {student.name}

              </span>


              <span className="student-value">

                {student.solved}

              </span>


              <span className="student-accuracy">

                {student.accuracy}%

              </span>


              <strong className="student-score">

                {student.score}

              </strong>

            </div>

          ))}


          {/* CURRENT USER */}

          <div className="current-user-row">

            <span>
              —
            </span>

            <span className="student-name">

              <span className="student-small-avatar current-avatar">

                {currentUser.name
                  .charAt(0)
                  .toUpperCase()}

              </span>

              {currentUser.name}
              <small>
                You
              </small>

            </span>

            <span>
              —
            </span>

            <span>
              —
            </span>

            <strong>
              —
            </strong>

          </div>

        </div>

      </section>


      {/* INFO */}

      <div className="leaderboard-info">

        <div>
          🏆
        </div>

        <div>

          <h3>
            How the leaderboard works
          </h3>

          <p>
            Your score increases as you solve questions and complete quizzes.
            Accuracy also contributes to your overall performance.
          </p>

        </div>

      </div>


    </div>

  );

}

export default Leaderboard;