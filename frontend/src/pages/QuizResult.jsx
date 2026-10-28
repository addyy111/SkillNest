import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

// API_BASE imported from client

function QuizResult() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const attemptIdParam = searchParams.get("attemptId");

  const user = JSON.parse(localStorage.getItem("skillnestUser") || "{}");
  const studentId = user?.id;

  const [result, setResult] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!location.state?.resultData && !!attemptIdParam);
  const [error, setError] = useState("");

  const fetchAttemptDetails = useCallback(async (attemptId) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/quizzes/attempts/${attemptId}?studentId=${studentId || 1}`);
      setResult(res.data);
    } catch (err) {
      console.error("Error loading attempt details:", err);
      setError("Unable to retrieve test result details.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (!result && attemptIdParam) {
      fetchAttemptDetails(attemptIdParam);
    }
  }, [result, attemptIdParam, fetchAttemptDetails]);

  if (loading) {
    return (
      <div className="test-page-container">
        <div className="test-loading-state">
          <div className="test-spinner"></div>
          <h2>Calculating Test Results...</h2>
          <p>Evaluating answers, calculating score, and checking passing criteria.</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="test-page-container">
        <div className="test-error-state">
          <h2>No Test Result Found</h2>
          <p>{error || "No recent test submission was found to display."}</p>
          <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/take-test" className="primary-btn">
              Browse Available Tests →
            </Link>
            <Link to="/dashboard" className="secondary-btn">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format time taken
  const timeTakenMins = Math.floor((result.timeTakenSeconds || 0) / 60);
  const timeTakenSecs = (result.timeTakenSeconds || 0) % 60;
  const timeTakenStr = `${timeTakenMins}m ${timeTakenSecs}s`;

  // Format date
  const formattedDate = result.submittedAt
    ? new Date(result.submittedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : "Recently submitted";

  const reviews = result.reviews || [];

  return (
    <div className="test-page-container result-page-wrap">
      {/* RESULT TOP BANNER */}
      <div className="result-header">
        <span className="section-label">OFFICIAL EVALUATION REPORT</span>
        <h1>Test Results: {result.quizTitle}</h1>
        <p>
          Candidate: <strong>{result.studentName}</strong> ({result.studentEmail}) • Completed on {formattedDate}
        </p>
      </div>

      {/* PASS / FAIL BANNER */}
      <div className={`result-outcome-banner ${result.passed ? "outcome-passed" : "outcome-failed"}`}>
        <div className="outcome-icon">{result.passed ? "🎉" : "📋"}</div>
        <div className="outcome-text">
          <h2>{result.passed ? "Congratulations! You Passed" : "Needs Improvement — Passing Score Not Met"}</h2>
          <p>
            {result.passed
              ? `You achieved ${result.score} out of ${result.totalMarks} marks, exceeding the required passing score of ${result.passingMarks} marks.`
              : `You scored ${result.score} out of ${result.totalMarks} marks. The passing requirement was ${result.passingMarks} marks. Review your mistakes below and retake when ready.`}
          </p>
        </div>
      </div>

      {/* SCORE & STATS ROW */}
      <div className="result-stats-grid">
        <div className="result-stat-card score-card">
          <span className="stat-card-title">Score Obtained</span>
          <div className="stat-big-number">
            {result.score} <span className="stat-total-sub">/ {result.totalMarks}</span>
          </div>
          <span className="stat-percent-badge">{result.percentage}%</span>
        </div>

        <div className="result-stat-card correct-card">
          <span className="stat-card-title">Correct Answers</span>
          <div className="stat-big-number" style={{ color: "var(--status-pass)" }}>
            {result.correctCount}
          </div>
          <small className="stat-subtext">+{result.score} marks earned</small>
        </div>

        <div className="result-stat-card incorrect-card">
          <span className="stat-card-title">Incorrect Answers</span>
          <div className="stat-big-number" style={{ color: "var(--status-fail)" }}>
            {result.incorrectCount}
          </div>
          <small className="stat-subtext">Review solutions below</small>
        </div>

        <div className="result-stat-card unanswered-card">
          <span className="stat-card-title">Unanswered</span>
          <div className="stat-big-number" style={{ color: "var(--text-muted-brown)" }}>
            {result.unansweredCount}
          </div>
          <small className="stat-subtext">No answer chosen</small>
        </div>

        <div className="result-stat-card time-card">
          <span className="stat-card-title">Time Taken</span>
          <div className="stat-big-number" style={{ color: "var(--primary-sorrell)" }}>
            {timeTakenStr}
          </div>
          <small className="stat-subtext">Verified server timing</small>
        </div>
      </div>

      {/* EMAIL STATUS ALERT */}
      <div className={`email-status-banner status-${(result.emailStatus || "not_configured").toLowerCase()}`}>
        <span className="email-status-icon">
          {result.emailStatus === "SENT" ? "✓" : "✉️"}
        </span>
        <div className="email-status-info">
          <strong>
            {result.emailStatus === "SENT"
              ? "Test results emailed to student"
              : result.emailStatus === "FAILED"
              ? "Email delivery pending"
              : "Email delivery offline (SMTP not configured in local environment)"}
          </strong>
          <p>
            {result.emailStatus === "SENT"
              ? `An official score report has been sent to ${result.studentEmail}.`
              : "Your test results are permanently saved in SkillNest. SMTP environment variables can be set to enable automated email delivery."}
          </p>
        </div>
      </div>

      {/* DETAILED QUESTION-BY-QUESTION REVIEW */}
      <div className="result-review-section">
        <div className="review-header-row">
          <div>
            <span className="section-label">DETAILED BREAKDOWN</span>
            <h2>Question Review & Explanations</h2>
          </div>
          <span className="review-count-pill">{reviews.length} Questions Evaluated</span>
        </div>

        <div className="review-cards-list">
          {reviews.map((q, idx) => {
            const options = [q.optionA, q.optionB, q.optionC, q.optionD];
            let statusBadge = "unanswered";
            let statusText = "Unanswered";

            if (!q.unanswered) {
              if (q.correct) {
                statusBadge = "correct";
                statusText = "Correct (+ " + q.marks + ")";
              } else {
                statusBadge = "incorrect";
                statusText = "Incorrect (0)";
              }
            }

            return (
              <div key={q.id || idx} className={`review-question-card status-${statusBadge}`}>
                <div className="review-q-top">
                  <div className="review-q-index">
                    <span className="q-badge-num">Q{idx + 1}</span>
                    <span className="review-category-tag">{q.category} • {q.topic || "General"}</span>
                  </div>
                  <span className={`review-status-pill pill-${statusBadge}`}>{statusText}</span>
                </div>

                <h3 className="review-q-title">{q.title}</h3>

                <div className="review-options-grid">
                  {options.map((optText, optIdx) => {
                    const isCorrectAnswer = optIdx === q.correctAnswer;
                    const isStudentPick = optIdx === q.selectedAnswer;

                    let optClass = "opt-normal";
                    if (isCorrectAnswer) optClass = "opt-correct-answer";
                    if (isStudentPick && !isCorrectAnswer) optClass = "opt-student-wrong";

                    return (
                      <div key={optIdx} className={`review-option-item ${optClass}`}>
                        <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                        <span className="opt-text">{optText}</span>
                        {isStudentPick && (
                          <span className="user-pick-tag">
                            {isCorrectAnswer ? "✓ Your Choice" : "✕ Your Choice"}
                          </span>
                        )}
                        {isCorrectAnswer && !isStudentPick && (
                          <span className="correct-answer-tag">✓ Correct Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="review-explanation-box">
                    <strong>💡 Solution Explanation:</strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="result-bottom-actions">
        <Link to="/take-test" className="primary-btn">
          Take Another Test →
        </Link>
        <Link to="/dashboard" className="secondary-btn">
          Back to Dashboard
        </Link>
        <button className="secondary-btn" onClick={() => window.print()}>
          🖨 Print / Save Result
        </button>
      </div>
    </div>
  );
}

export default QuizResult;