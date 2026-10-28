import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

// API_BASE imported from client

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Preview Modal
  const [previewTest, setPreviewTest] = useState(null);

  // Student Attempts Modal
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "java",
    difficulty: "Medium",
    duration: 15,
    passingMarks: 0,
    status: "PUBLISHED",
    description: "",
    questionIds: []
  });

  // Fetch quizzes, questions, and attempts
  const fetchData = useCallback(async () => {
    try {
      setError("");
      const [quizzesRes, questionsRes, attemptsRes] = await Promise.all([
        axios.get(`${API_BASE}/quizzes`),
        axios.get(`${API_BASE}/questions`),
        axios.get(`${API_BASE}/quizzes/attempts`).catch(() => ({ data: [] }))
      ]);

      setQuizzes(quizzesRes.data || []);
      setQuestions(questionsRes.data || []);
      setAttempts(attemptsRes.data || []);
    } catch (err) {
      console.error("Error loading admin quizzes:", err);
      setError("Unable to load tests, questions, or attempts from backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "passingMarks" ? Number(value) : value
    }));
  };

  // Toggle question selection
  const handleToggleQuestion = (questionId) => {
    setFormData((prev) => {
      const exists = prev.questionIds.includes(questionId);
      const updatedIds = exists
        ? prev.questionIds.filter((id) => id !== questionId)
        : [...prev.questionIds, questionId];

      // Auto compute passing marks if not explicitly customized
      const selectedQuestions = questions.filter((q) => updatedIds.includes(q.id));
      const totalMarks = selectedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);
      const suggestedPassing = Math.ceil(totalMarks * 0.5);

      return {
        ...prev,
        questionIds: updatedIds,
        passingMarks: prev.passingMarks > 0 ? prev.passingMarks : suggestedPassing
      };
    });
  };

  // Calculate live total marks from selected questions
  const selectedQuestions = questions.filter((q) => formData.questionIds.includes(q.id));
  const calculatedTotalMarks = selectedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      category: "java",
      difficulty: "Medium",
      duration: 15,
      passingMarks: 0,
      status: "PUBLISHED",
      description: "",
      questionIds: []
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // Create or Update Test
  const handleSubmit = async (e, saveStatus = null) => {
    if (e) e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please provide a valid test title.");
      return;
    }

    if (!formData.duration || formData.duration <= 0) {
      setError("Duration must be a positive number of minutes.");
      return;
    }

    if (formData.questionIds.length === 0) {
      setError("A test must contain at least one question.");
      return;
    }

    const finalStatus = saveStatus || formData.status || "PUBLISHED";
    const finalPassingMarks =
      formData.passingMarks > 0 ? formData.passingMarks : Math.ceil(calculatedTotalMarks * 0.5);

    const testPayload = {
      title: formData.title.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      duration: formData.duration,
      totalMarks: calculatedTotalMarks,
      passingMarks: finalPassingMarks,
      status: finalStatus,
      description: formData.description.trim(),
      questions: formData.questionIds.map((id) => ({ id }))
    };

    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${API_BASE}/quizzes/${editingId}`, testPayload);
        alert(`Test updated successfully (${finalStatus === "DRAFT" ? "Saved as Draft" : "Published"}).`);
      } else {
        await axios.post(`${API_BASE}/quizzes`, testPayload);
        alert(`Test created successfully (${finalStatus === "DRAFT" ? "Saved as Draft" : "Published"}).`);
      }

      resetForm();
      await fetchData();
    } catch (err) {
      console.error("Error saving test:", err);
      setError(err.response?.data?.message || "Failed to save test. Verify backend connection.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Publication Status (Draft vs Published)
  const handleToggleStatus = async (test) => {
    const newStatus = test.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
    try {
      await axios.put(`${API_BASE}/quizzes/${test.id}/status`, { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Unable to change test publication status.");
    }
  };

  // Edit Test
  const handleEdit = (test) => {
    setFormData({
      title: test.title || "",
      category: test.category || "java",
      difficulty: test.difficulty || "Medium",
      duration: test.duration || 15,
      passingMarks: test.passingMarks || 0,
      status: test.status || "PUBLISHED",
      description: test.description || "",
      questionIds: test.questions ? test.questions.map((q) => q.id) : []
    });

    setEditingId(test.id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Test
  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Are you sure you want to delete test "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/quizzes/${id}`);
      alert("Test deleted successfully.");
      await fetchData();
    } catch (err) {
      console.error("Error deleting test:", err);
      alert("Failed to delete test.");
    }
  };

  // Filter available questions by selected category
  const availableQuestions = questions.filter(
    (q) => q.category?.toLowerCase() === formData.category.toLowerCase()
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
          <span className="section-label">ADMINISTRATION</span>
          <h1>Test Management</h1>
          <p>Create, publish, edit, preview, and review technical tests and student attempts.</p>
        </div>

        <div className="admin-header-buttons">
          <Link to="/admin" className="secondary-btn">
            ← Dashboard
          </Link>

          <button
            className="secondary-btn"
            onClick={() => setShowAttemptsModal(true)}
          >
            📋 Student Attempts ({attempts.length})
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              if (showForm) resetForm();
              else {
                setShowForm(true);
                setError("");
              }
            }}
          >
            {showForm ? "Cancel" : "+ Create New Test"}
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="admin-error-banner">
          <strong>Error:</strong> <span>{error}</span>
        </div>
      )}

      {/* CREATE / EDIT FORM */}
      {showForm && (
        <div className="admin-form-card">
          <div className="form-card-header">
            <div>
              <span className="section-label">{editingId ? "UPDATE TEST" : "NEW TEST CREATION"}</span>
              <h2>{editingId ? "Edit Test Details" : "Create Technical Test"}</h2>
            </div>
            <span className={`status-badge-pill ${formData.status.toLowerCase()}`}>
              {formData.status}
            </span>
          </div>

          <form onSubmit={(e) => handleSubmit(e, formData.status)}>
            <div className="form-grid-2">
              <div className="form-field full-col">
                <label>Test Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Senior Java Backend Placement Test"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="c++">C++</option>
                  <option value="javascript">JavaScript</option>
                  <option value="react">React</option>
                  <option value="node.js">Node.js</option>
                  <option value="sql">SQL</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
              </div>

              <div className="form-field">
                <label>Difficulty *</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-field">
                <label>Duration (Minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  max="180"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Passing Marks *{" "}
                  <small style={{ color: "var(--text-muted-brown)" }}>
                    (Suggested: {Math.ceil(calculatedTotalMarks * 0.5)})
                  </small>
                </label>
                <input
                  type="number"
                  name="passingMarks"
                  min="1"
                  max={calculatedTotalMarks || 100}
                  value={formData.passingMarks || Math.ceil(calculatedTotalMarks * 0.5)}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field full-col">
                <label>Description & Guidelines</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Explain the focus of this test, recommended preparation, and guidelines..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* QUESTION SELECTOR */}
            <div className="form-question-picker">
              <div className="picker-header">
                <div>
                  <h4>Select Test Questions</h4>
                  <p>Choose questions from the question bank for category: <strong>{formData.category}</strong></p>
                </div>
                <div className="picker-stats">
                  <span>Selected: <strong>{formData.questionIds.length}</strong> questions</span>
                  <span>Total Marks: <strong>{calculatedTotalMarks}</strong></span>
                </div>
              </div>

              {availableQuestions.length === 0 ? (
                <div className="picker-empty">
                  <p>No questions found in question bank for category "{formData.category}".</p>
                  <Link to="/admin/questions" className="secondary-btn" style={{ marginTop: "10px" }}>
                    + Add Questions to Bank
                  </Link>
                </div>
              ) : (
                <div className="picker-list">
                  {availableQuestions.map((q) => {
                    const isSelected = formData.questionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`picker-item ${isSelected ? "selected" : ""}`}
                        onClick={() => handleToggleQuestion(q.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent div
                        />
                        <div className="picker-item-info">
                          <strong>{q.title}</strong>
                          <div className="picker-item-meta">
                            <span>Topic: {q.topic || "General"}</span>
                            <span>Difficulty: {q.difficulty}</span>
                            <span className="q-mark-tag">+{q.marks || 1} {q.marks === 1 ? "Mark" : "Marks"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FORM SUBMISSION ACTIONS */}
            <div className="form-actions-row">
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>

              <div className="form-submit-group">
                <button
                  type="button"
                  className="secondary-btn save-draft-btn"
                  onClick={(e) => handleSubmit(e, "DRAFT")}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save as Draft 💾"}
                </button>

                <button
                  type="button"
                  className="primary-btn publish-now-btn"
                  onClick={(e) => handleSubmit(e, "PUBLISHED")}
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingId ? "Update & Publish ✓" : "Create & Publish Now →"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TESTS LIST TABLE & CARDS */}
      <div className="admin-tests-section">
        <div className="section-toolbar">
          <h2>All Created Tests ({quizzes.length})</h2>
          <span>Manage publication status, preview tests, or view student attempts</span>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <div className="test-spinner"></div>
            <p>Loading tests and assessments...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">📝</div>
            <h3>No Tests Created Yet</h3>
            <p>Get started by creating your first technical test using the button above.</p>
          </div>
        ) : (
          <div className="admin-tests-grid">
            {quizzes.map((quiz) => {
              const questionCount = quiz.questions ? quiz.questions.length : 0;
              const isDraft = quiz.status === "DRAFT";
              const testAttempts = attempts.filter((a) => a.quiz?.id === quiz.id);

              return (
                <div key={quiz.id} className={`admin-test-card ${isDraft ? "is-draft" : ""}`}>
                  <div className="test-card-top-row">
                    <span className="test-category-badge">{quiz.category}</span>
                    <span className={`status-pill ${isDraft ? "draft" : "published"}`}>
                      {quiz.status || "PUBLISHED"}
                    </span>
                  </div>

                  <h3 className="admin-card-title">{quiz.title}</h3>
                  <p className="admin-card-desc">
                    {quiz.description || "No description provided."}
                  </p>

                  <div className="admin-meta-chips">
                    <span>⏱ {quiz.duration} min</span>
                    <span>📋 {questionCount} questions</span>
                    <span>🎯 {quiz.totalMarks || questionCount} marks</span>
                    <span>✓ Pass: {quiz.passingMarks || Math.ceil((quiz.totalMarks || 1) * 0.5)}</span>
                  </div>

                  <div className="test-attempts-count">
                    <span>Student Submissions: <strong>{testAttempts.length}</strong></span>
                  </div>

                  <div className="admin-card-actions">
                    <button
                      className="secondary-btn btn-sm"
                      onClick={() => setPreviewTest(quiz)}
                      title="Preview how students see this test"
                    >
                      👁 Preview
                    </button>

                    <button
                      className={`btn-sm ${isDraft ? "publish-btn" : "unpublish-btn"}`}
                      onClick={() => handleToggleStatus(quiz)}
                    >
                      {isDraft ? "✓ Publish" : "⏸ Unpublish"}
                    </button>

                    <button
                      className="secondary-btn btn-sm"
                      onClick={() => handleEdit(quiz)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-btn btn-sm"
                      onClick={() => handleDelete(quiz.id, quiz.title)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PREVIEW TEST MODAL */}
      {previewTest && (
        <div className="modal-backdrop" onClick={() => setPreviewTest(null)}>
          <div className="modal-content test-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-label">ADMIN PREVIEW</span>
                <h2>{previewTest.title}</h2>
                <span className={`status-badge-pill ${previewTest.status?.toLowerCase() || "published"}`}>
                  {previewTest.status || "PUBLISHED"}
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setPreviewTest(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="preview-meta-bar">
                <span>Category: <strong>{previewTest.category}</strong></span>
                <span>Difficulty: <strong>{previewTest.difficulty || "Medium"}</strong></span>
                <span>Duration: <strong>{previewTest.duration} min</strong></span>
                <span>Total Marks: <strong>{previewTest.totalMarks || previewTest.questions?.length || 0}</strong></span>
                <span>Passing Criteria: <strong>{previewTest.passingMarks || 0} marks</strong></span>
              </div>

              <h4 style={{ margin: "20px 0 10px 0", color: "var(--text-deep-brown)" }}>
                Questions in this Test ({previewTest.questions?.length || 0}):
              </h4>

              <div className="preview-questions-list">
                {(!previewTest.questions || previewTest.questions.length === 0) ? (
                  <p>No questions attached to this test.</p>
                ) : (
                  previewTest.questions.map((q, idx) => (
                    <div key={q.id || idx} className="preview-q-card">
                      <div className="preview-q-top">
                        <strong>Q{idx + 1}. {q.title}</strong>
                        <span className="q-marks-pill">+{q.marks || 1} Marks</span>
                      </div>
                      <div className="preview-options">
                        <div>A: {q.optionA} {q.answer === 0 && <span className="correct-tag">✓ Correct</span>}</div>
                        <div>B: {q.optionB} {q.answer === 1 && <span className="correct-tag">✓ Correct</span>}</div>
                        <div>C: {q.optionC} {q.answer === 2 && <span className="correct-tag">✓ Correct</span>}</div>
                        <div>D: {q.optionD} {q.answer === 3 && <span className="correct-tag">✓ Correct</span>}</div>
                      </div>
                      {q.explanation && (
                        <div className="preview-expl">
                          <small>💡 Explanation: {q.explanation}</small>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="primary-btn" onClick={() => setPreviewTest(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ATTEMPTS & TEST RESULTS MODAL */}
      {showAttemptsModal && (
        <div className="modal-backdrop" onClick={() => setShowAttemptsModal(false)}>
          <div className="modal-content attempts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-label">STUDENT EVALUATIONS</span>
                <h2>All Student Test Attempts ({attempts.length})</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAttemptsModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {attempts.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No student test attempts recorded yet.</p>
                </div>
              ) : (
                <div className="attempts-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Test Title</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Email</th>
                        <th>Submitted At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((att) => (
                        <tr key={att.id}>
                          <td>#{att.id}</td>
                          <td>
                            <strong>{att.student?.name}</strong>
                            <small style={{ display: "block", color: "var(--text-muted-brown)" }}>
                              {att.student?.email}
                            </small>
                          </td>
                          <td>{att.quiz?.title}</td>
                          <td>
                            <strong>{att.score} / {att.totalMarks}</strong> ({att.percentage}%)
                          </td>
                          <td>
                            <span className={`status-badge-pill ${att.passed ? "published" : "failed"}`}>
                              {att.passed ? "Passed" : "Failed"}
                            </span>
                          </td>
                          <td>{Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s</td>
                          <td>
                            <span className={`email-tag status-${att.emailStatus?.toLowerCase()}`}>
                              {att.emailStatus === "SENT" ? "✓ Sent" : att.emailStatus === "FAILED" ? "✕ Failed" : "Offline"}
                            </span>
                          </td>
                          <td>{new Date(att.submittedAt).toLocaleDateString()}</td>
                          <td>
                            <Link
                              to={`/take-test/result?attemptId=${att.id}`}
                              target="_blank"
                              className="secondary-btn btn-sm"
                            >
                              View Report ↗
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="primary-btn" onClick={() => setShowAttemptsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminQuizzes;