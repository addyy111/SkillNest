import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

function QuestionList() {
  const { category } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API_BASE}/questions/category/${category}`
      );

      setQuestions(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load questions.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const displayCategory =
    category === "c++"
      ? "C++"
      : category === "javascript"
      ? "JavaScript"
      : category === "react"
      ? "React"
      : category === "node.js"
      ? "Node.js"
      : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "";

  return (
    <div className="page question-list-page">

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/questions">Practice</Link>
        <span>›</span>
        <span className="breadcrumb-current">
          {displayCategory}
        </span>
      </div>

      {/* HEADER */}
      <div className="question-list-header">
        <div>
          <p className="question-list-label">
            {displayCategory.toUpperCase()} PRACTICE
          </p>

          <h1>{displayCategory} Questions</h1>

          <p>
            Practice {displayCategory} questions
            and improve your technical skills.
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="question-loading">
          Loading questions...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="question-error">
          {error}
        </div>
      )}

      {/* QUESTION COUNT */}
      {!loading && !error && (
        <div className="question-list-count">
          <strong>{questions.length}</strong>
          <span> practice questions</span>
        </div>
      )}

      {/* QUESTIONS */}
      {!loading && !error && questions.length > 0 && (
        <div className="question-list">
          {questions.map((question, index) => (
            <Link
              key={question.id}
              to={`/questions/${category}/${question.id}`}
              className="question-card"
            >
              <div className="question-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="question-content">
                <h3>{question.title}</h3>

                <div className="question-meta">
                  <span>{question.topic}</span>

                  <span
                    className={`question-difficulty ${
                      question.difficulty
                        ? question.difficulty.toLowerCase()
                        : "easy"
                    }`}
                  >
                    {question.difficulty || "Easy"}
                  </span>
                </div>
              </div>

              <div className="question-arrow">
                →
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* NO QUESTIONS */}
      {!loading && !error && questions.length === 0 && (
        <div className="question-empty">
          <h2>No questions available</h2>

          <p>
            There are currently no questions
            available for {displayCategory}.
          </p>

          <Link
            to="/questions"
            className="back-practice-btn"
          >
            ← All Categories
          </Link>
        </div>
      )}

      {/* BACK */}
      <div className="question-list-bottom">
        <Link
          to="/questions"
          className="back-practice-btn"
        >
          ← All Categories
        </Link>
      </div>

    </div>
  );
}

export default QuestionList;