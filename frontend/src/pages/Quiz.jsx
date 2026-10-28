import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

// API_BASE imported from client

function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testIdParam = searchParams.get("id");

  const user = JSON.parse(localStorage.getItem("skillnestUser") || "{}");
  const studentId = user?.id;

  // Catalog State
  const [tests, setTests] = useState([]);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Instructions Modal State
  const [previewTest, setPreviewTest] = useState(null);

  // Active Test State
  const [activeTest, setActiveTest] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set()); // Set of questionIds
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAnswersRef = useRef(selectedAnswers);
  const activeTestRef = useRef(activeTest);
  const timeLeftRef = useRef(timeLeft);
  const totalDurationRef = useRef(totalDuration);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    activeTestRef.current = activeTest;
  }, [activeTest]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

  // Prevent accidental navigation during active test
  useEffect(() => {
    if (!activeTest) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You have an active test session. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeTest]);

  // Submit test to backend
  const handleSubmitTest = useCallback(async () => {
    const test = activeTestRef.current;
    if (!test || isSubmitting) return;

    setIsSubmitting(true);
    const answers = selectedAnswersRef.current;
    const timeTaken = Math.max(1, totalDurationRef.current - timeLeftRef.current);

    try {
      const payload = {
        studentId: studentId || 1,
        answers: answers,
        timeTakenSeconds: timeTaken
      };

      const response = await axios.post(`${API_BASE}/quizzes/${test.id}/submit`, payload);
      const resultData = response.data;

      // Navigate to Take Test result screen
      navigate("/take-test/result", {
        state: { resultData }
      });
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Failed to submit test. Please try again or check your network.");
      setIsSubmitting(false);
    }
  }, [isSubmitting, studentId, navigate]);

  // Load published tests and student past attempts
  const fetchCatalogData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [testsRes, attemptsRes] = await Promise.all([
        axios.get(`${API_BASE}/quizzes/published`),
        studentId ? axios.get(`${API_BASE}/quizzes/attempts/student/${studentId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);

      const testList = testsRes.data || [];
      setTests(testList);
      setStudentAttempts(attemptsRes.data || []);

      // If test ID param is present in URL, open instructions for that test
      if (testIdParam) {
        const found = testList.find((t) => String(t.id) === String(testIdParam));
        if (found) {
          setPreviewTest(found);
        }
      }
    } catch (err) {
      console.error("Error loading tests catalog:", err);
      setError("Unable to load tests from backend. Make sure the Spring Boot service is running.");
    } finally {
      setLoading(false);
    }
  }, [studentId, testIdParam]);

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  // Start test after reviewing instructions
  const handleStartTest = async (test) => {
    setPreviewTest(null);
    setLoading(true);

    try {
      // Anti-cheat endpoint: strips answers and explanations
      const response = await axios.get(`${API_BASE}/quizzes/${test.id}/take`);
      const testData = response.data;

      setActiveTest(testData);
      setActiveQuestions(testData.questions || []);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setFlaggedQuestions(new Set());

      const seconds = (testData.duration || 10) * 60;
      setTimeLeft(seconds);
      setTotalDuration(seconds);
      setShowSubmitModal(false);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error starting test:", err);
      alert("Unable to start test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!activeTest) return;

    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, timeLeft, handleSubmitTest]);

  // Answer selection
  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Clear answer
  const handleClearAnswer = (questionId) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Toggle flag for review
  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const copy = new Set(prev);
      if (copy.has(questionId)) {
        copy.delete(questionId);
      } else {
        copy.add(questionId);
      }
      return copy;
    });
  };

  // Filter tests by category and search
  const filteredTests = tests.filter((test) => {
    const matchesCategory =
      selectedCategory === "all" ||
      test.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      test.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Unique categories for filter pills
  const categories = ["all", ...new Set(tests.map((t) => t.category?.toLowerCase()).filter(Boolean))];

  // Helper: find student's attempt for a specific test
  const getAttemptForTest = (testId) => {
    return studentAttempts.find((a) => a.quiz?.id === testId);
  };

  // Loading view
  if (loading && !activeTest) {
    return (
      <div className="test-page-container">
        <div className="test-loading-state">
          <div className="test-spinner"></div>
          <h2>Loading Available Tests...</h2>
          <p>Preparing technical assessments and verification criteria.</p>
        </div>
      </div>
    );
  }

  // Error view
  if (error && !activeTest) {
    return (
      <div className="test-page-container">
        <div className="test-error-state">
          <h2>Connection Issue</h2>
          <p>{error}</p>
          <button className="primary-btn" onClick={fetchCatalogData} style={{ marginTop: "16px" }}>
            ↻ Retry
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: CATALOG OF PUBLISHED TESTS (STUDENT DASHBOARD)
  // =========================================================================
  if (!activeTest) {
    return (
      <div className="test-page-container">
        {/* HERO / HEADER */}
        <div className="test-header">
          <div>
            <span className="section-label">ASSESSMENTS & EVALUATION</span>
            <h1>Take Test</h1>
            <p>
              Evaluate your technical proficiency under realistic interview conditions.
              Timed questions, instant scoring, and comprehensive explanations.
            </p>
          </div>
          <Link to="/dashboard" className="secondary-btn">
            ← Dashboard
          </Link>
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div className="test-filter-bar">
          <div className="test-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search tests by title, topic, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>

          <div className="test-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TEST CARDS GRID */}
        {filteredTests.length === 0 ? (
          <div className="test-empty-state">
            <div className="empty-icon">📝</div>
            <h3>No Tests Found</h3>
            <p>
              {searchQuery
                ? `No tests match "${searchQuery}". Try a different keyword.`
                : "No tests are currently published in this category. Check back soon!"}
            </p>
            {searchQuery && (
              <button className="secondary-btn" onClick={() => setSearchQuery("")} style={{ marginTop: "12px" }}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="test-card-grid">
            {filteredTests.map((test) => {
              const attempt = getAttemptForTest(test.id);
              const questionCount = test.questions ? test.questions.length : 0;
              const difficultyClass = `difficulty-${(test.difficulty || "medium").toLowerCase()}`;

              return (
                <div key={test.id} className="test-card">
                  <div className="test-card-header">
                    <span className="test-category-badge">{test.category}</span>
                    <span className={`test-difficulty-badge ${difficultyClass}`}>
                      {test.difficulty || "Medium"}
                    </span>
                  </div>

                  <h3 className="test-card-title">{test.title}</h3>
                  <p className="test-card-desc">
                    {test.description || "Comprehensive technical assessment covering core concepts and problem solving."}
                  </p>

                  <div className="test-meta-grid">
                    <div className="test-meta-item">
                      <span className="meta-label">Duration</span>
                      <strong className="meta-val">⏱ {test.duration} min</strong>
                    </div>
                    <div className="test-meta-item">
                      <span className="meta-label">Questions</span>
                      <strong className="meta-val">📋 {questionCount}</strong>
                    </div>
                    <div className="test-meta-item">
                      <span className="meta-label">Total Marks</span>
                      <strong className="meta-val">🎯 {test.totalMarks || questionCount}</strong>
                    </div>
                    <div className="test-meta-item">
                      <span className="meta-label">Pass Marks</span>
                      <strong className="meta-val">✓ {test.passingMarks || Math.ceil((test.totalMarks || questionCount) * 0.5)}</strong>
                    </div>
                  </div>

                  {attempt && (
                    <div className={`test-attempt-badge ${attempt.passed ? "passed" : "failed"}`}>
                      <span>{attempt.passed ? "✓ Passed" : "✕ Not Passed"}</span>
                      <span>Score: {attempt.score} / {attempt.totalMarks} ({attempt.percentage}%)</span>
                    </div>
                  )}

                  <div className="test-card-footer">
                    <button
                      className="primary-btn test-start-btn"
                      onClick={() => setPreviewTest(test)}
                      disabled={questionCount === 0}
                    >
                      {questionCount === 0 ? "Under Review" : attempt ? "Retake Test →" : "Start Test →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PRE-TEST INSTRUCTIONS MODAL */}
        {previewTest && (
          <div className="modal-backdrop" onClick={() => setPreviewTest(null)}>
            <div className="modal-content test-instructions-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="section-label">BEFORE YOU BEGIN</span>
                  <h2>{previewTest.title}</h2>
                </div>
                <button className="modal-close-btn" onClick={() => setPreviewTest(null)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <p className="modal-desc">{previewTest.description || "Please review the instructions below carefully before starting your test."}</p>

                <div className="instructions-stats-card">
                  <div className="inst-stat">
                    <span>Duration</span>
                    <strong>{previewTest.duration} Minutes</strong>
                  </div>
                  <div className="inst-stat">
                    <span>Questions</span>
                    <strong>{previewTest.questions?.length || 0} Questions</strong>
                  </div>
                  <div className="inst-stat">
                    <span>Total Marks</span>
                    <strong>{previewTest.totalMarks || previewTest.questions?.length || 0} Marks</strong>
                  </div>
                  <div className="inst-stat">
                    <span>Passing Criteria</span>
                    <strong>{previewTest.passingMarks || Math.ceil((previewTest.totalMarks || 1) * 0.5)} Marks</strong>
                  </div>
                </div>

                <div className="test-rules-box">
                  <h4>Important Test Rules & Guidelines:</h4>
                  <ul>
                    <li>✦ <strong>Timed Session:</strong> Once started, the countdown timer runs continuously. Auto-submission occurs when the timer expires.</li>
                    <li>✦ <strong>Navigation Palette:</strong> You can jump between questions, review answered questions, and flag questions for later review.</li>
                    <li>✦ <strong>Anti-Cheat Protection:</strong> Correct answers and explanations are hidden during the test and will be revealed after submission.</li>
                    <li>✦ <strong>Integrity:</strong> Do not refresh the page or navigate away during an active test session.</li>
                    <li>✦ <strong>Email Results:</strong> An official result breakdown will be recorded and dispatched to your registered email address upon completion.</li>
                  </ul>
                </div>
              </div>

              <div className="modal-footer">
                <button className="secondary-btn" onClick={() => setPreviewTest(null)}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={() => handleStartTest(previewTest)}>
                  Start Test Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ACTIVE TEST-TAKING INTERFACE
  // =========================================================================
  const currentQ = activeQuestions[currentQuestionIndex];
  const qOptions = currentQ ? [currentQ.optionA, currentQ.optionB, currentQ.optionC, currentQ.optionD] : [];
  const currentSelected = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isFlagged = currentQ ? flaggedQuestions.has(currentQ.id) : false;

  // Counts for palette
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = activeQuestions.length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = flaggedQuestions.size;

  // Timer format
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isTimerCritical = timeLeft < 120; // under 2 minutes

  return (
    <div className="active-test-container">
      {/* ACTIVE TEST TOP BAR */}
      <div className="active-test-topbar">
        <div className="test-info-header">
          <span className="test-category-badge">{activeTest.category}</span>
          <h2>{activeTest.title}</h2>
        </div>

        <div className={`active-test-timer ${isTimerCritical ? "timer-warning" : ""}`}>
          <span className="timer-icon">⏱</span>
          <div className="timer-readout">
            <small>Time Remaining</small>
            <strong>
              {mins}:{secs.toString().padStart(2, "0")}
            </strong>
          </div>
        </div>

        <button className="primary-btn finish-btn" onClick={() => setShowSubmitModal(true)}>
          Finish & Submit ✓
        </button>
      </div>

      {/* ACTIVE TEST MAIN LAYOUT (QUESTION + PALETTE) */}
      <div className="active-test-layout">
        {/* LEFT / MAIN: QUESTION CARD */}
        <div className="active-question-panel">
          <div className="question-header-row">
            <div className="q-badge-group">
              <span className="q-number-pill">
                Question {currentQuestionIndex + 1} of {totalCount}
              </span>
              <span className="q-marks-pill">
                +{currentQ?.marks || 1} {currentQ?.marks === 1 ? "Mark" : "Marks"}
              </span>
            </div>

            <button
              className={`flag-btn ${isFlagged ? "flagged" : ""}`}
              onClick={() => handleToggleFlag(currentQ.id)}
            >
              🚩 {isFlagged ? "Flagged for Review" : "Flag Question"}
            </button>
          </div>

          <h3 className="active-question-text">{currentQ?.title}</h3>

          {/* 4 OPTIONS */}
          <div className="options-container">
            {qOptions.map((optText, idx) => {
              const isSelected = currentSelected === idx;
              return (
                <button
                  key={idx}
                  className={`option-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                >
                  <span className="option-indicator">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{optText}</span>
                  {isSelected && <span className="option-check-icon">✓</span>}
                </button>
              );
            })}
          </div>

          {/* QUESTION ACTION BAR */}
          <div className="question-bottom-actions">
            <div>
              {currentSelected !== undefined && (
                <button className="clear-btn" onClick={() => handleClearAnswer(currentQ.id)}>
                  Clear Selection
                </button>
              )}
            </div>

            <div className="step-nav-buttons">
              <button
                className="secondary-btn"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </button>

              {currentQuestionIndex < totalCount - 1 ? (
                <button
                  className="primary-btn"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                >
                  Next Question →
                </button>
              ) : (
                <button className="primary-btn finish-btn" onClick={() => setShowSubmitModal(true)}>
                  Submit Test ✓
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT / SIDEBAR: QUESTION NAVIGATION PALETTE */}
        <div className="palette-sidebar">
          <h3>Question Palette</h3>

          <div className="palette-summary-chips">
            <div className="summary-chip answered">
              <span>{answeredCount}</span>
              <small>Answered</small>
            </div>
            <div className="summary-chip unanswered">
              <span>{unansweredCount}</span>
              <small>Unanswered</small>
            </div>
            <div className="summary-chip flagged">
              <span>{flaggedCount}</span>
              <small>Flagged</small>
            </div>
          </div>

          <div className="palette-grid">
            {activeQuestions.map((q, idx) => {
              const isAns = selectedAnswers[q.id] !== undefined;
              const isCur = idx === currentQuestionIndex;
              const isFlg = flaggedQuestions.has(q.id);

              let statusClass = "unanswered";
              if (isCur) statusClass = "current";
              else if (isFlg) statusClass = "flagged";
              else if (isAns) statusClass = "answered";

              return (
                <button
                  key={q.id || idx}
                  className={`palette-btn ${statusClass}`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                >
                  {idx + 1}
                  {isFlg && <span className="palette-flag-dot">🚩</span>}
                </button>
              );
            })}
          </div>

          <div className="palette-legend">
            <div className="legend-item">
              <span className="legend-dot current"></span> Current
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span> Answered
            </div>
            <div className="legend-item">
              <span className="legend-dot unanswered"></span> Unanswered
            </div>
            <div className="legend-item">
              <span className="legend-dot flagged"></span> Flagged
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL BEFORE FINAL SUBMIT */}
      {showSubmitModal && (
        <div className="modal-backdrop" onClick={() => !isSubmitting && setShowSubmitModal(false)}>
          <div className="modal-content submit-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Test Submission</h2>
              <button
                className="modal-close-btn"
                onClick={() => !isSubmitting && setShowSubmitModal(false)}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to finish and submit your test? Here is your test status:</p>

              <div className="submit-summary-box">
                <div className="submit-stat">
                  <span>Answered</span>
                  <strong style={{ color: "var(--status-pass)" }}>{answeredCount}</strong>
                </div>
                <div className="submit-stat">
                  <span>Unanswered</span>
                  <strong style={{ color: "var(--status-fail)" }}>{unansweredCount}</strong>
                </div>
                <div className="submit-stat">
                  <span>Flagged</span>
                  <strong style={{ color: "var(--status-warn)" }}>{flaggedCount}</strong>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="submit-warning-note">
                  ⚠️ You have <strong>{unansweredCount} unanswered questions</strong>. You can return to answer them before submitting.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
              >
                Return to Test
              </button>
              <button
                className="primary-btn submit-final-btn"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting & Evaluating..." : "Yes, Submit Test ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;