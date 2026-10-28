import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

function QuestionDetails() {
  const { category, id } = useParams();

  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkBookmarkStatus = useCallback((questionId, cat) => {
    try {
      const savedBookmarks =
        JSON.parse(localStorage.getItem("skillnestBookmarks")) || [];
      return savedBookmarks.some(
        (bookmark) =>
          String(bookmark.id) === String(questionId) &&
          bookmark.category?.toLowerCase() === cat?.toLowerCase()
      );
    } catch {
      return false;
    }
  }, []);

  const fetchQuestion = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API_BASE}/questions/${id}`
      );

      const qData = response.data;
      setQuestion(qData);
      setIsBookmarked(checkBookmarkStatus(qData.id, category));

    } catch (err) {
      console.error(err);
      setError("Unable to load question.");
    } finally {
      setLoading(false);
    }
  }, [id, category, checkBookmarkStatus]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const toggleBookmark = () => {
    if (!question) return;

    try {
      const savedBookmarks =
        JSON.parse(localStorage.getItem("skillnestBookmarks")) || [];

      if (isBookmarked) {
        const updatedBookmarks = savedBookmarks.filter(
          (bookmark) =>
            !(
              String(bookmark.id) === String(question.id) &&
              bookmark.category?.toLowerCase() === category?.toLowerCase()
            )
        );

        localStorage.setItem(
          "skillnestBookmarks",
          JSON.stringify(updatedBookmarks)
        );
        setIsBookmarked(false);
      } else {
        const bookmarkData = {
          id: question.id,
          title: question.title,
          category: category,
          topic: question.topic,
          difficulty: question.difficulty
        };

        const updatedBookmarks = [...savedBookmarks, bookmarkData];
        localStorage.setItem(
          "skillnestBookmarks",
          JSON.stringify(updatedBookmarks)
        );
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="question-loading">
        Loading question...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="question-error">
        <h2>{error}</h2>
        <Link to="/questions">← Back to Practice</Link>
      </div>
    );
  }

  // Question doesn't exist
  if (!question) {
    return (
      <div className="question-not-found">
        <h1>Question Not Found</h1>
        <p>The question you're looking for doesn't exist.</p>
        <Link to="/questions">← Back to Practice</Link>
      </div>
    );
  }

  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD
  ];

  const isCorrect = selectedAnswer === question.answer;

  const displayCategory =
    category === "javascript"
      ? "JavaScript"
      : category === "react"
      ? "React"
      : category === "node.js"
      ? "Node.js"
      : category === "c++"
      ? "C++"
      : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "";

  return (
    <div className="question-details-page">
      {/* BREADCRUMB */}
      <div className="question-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/questions">Practice</Link>
        <span>›</span>
        <Link to={`/questions/${category}`}>{displayCategory}</Link>
        <span>›</span>
        <strong>Question {id}</strong>
      </div>

      {/* HEADER */}
      <div className="question-details-header">
        <div>
          <span className="section-label">
            {displayCategory.toUpperCase()} PRACTICE
          </span>
          <h1>Question {id}</h1>
        </div>

        <div className="question-header-actions">
          <span
            className={`question-difficulty ${
              question.difficulty ? question.difficulty.toLowerCase() : "easy"
            }`}
          >
            {question.difficulty || "Easy"}
          </span>

          <button
            className={`bookmark-question-btn ${
              isBookmarked ? "bookmarked" : ""
            }`}
            onClick={toggleBookmark}
          >
            {isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
          </button>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="question-main-card">
        <div className="question-meta">
          <span>{question.topic}</span>
          <span>Question {id}</span>
        </div>

        <h2>{question.title}</h2>

        {/* OPTIONS */}
        <div className="options-list">
          {options.map((option, index) => {
            let optionClass = "";

            if (submitted) {
              if (index === question.answer) {
                optionClass = "correct";
              } else if (
                index === selectedAnswer &&
                index !== question.answer
              ) {
                optionClass = "incorrect";
              }
            } else if (selectedAnswer === index) {
              optionClass = "selected";
            }

            return (
              <button
                key={index}
                className={`answer-option ${optionClass}`}
                onClick={() => {
                  if (!submitted) {
                    setSelectedAnswer(index);
                  }
                }}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="option-text">{option}</span>

                {submitted && index === question.answer && (
                  <span className="answer-status">✓</span>
                )}

                {submitted &&
                  index === selectedAnswer &&
                  index !== question.answer && (
                    <span className="answer-status wrong">✕</span>
                  )}
              </button>
            );
          })}
        </div>

        {/* SUBMIT */}
        {!submitted && (
          <button
            className="submit-answer-btn"
            disabled={selectedAnswer === null}
            onClick={() => setSubmitted(true)}
          >
            Submit Answer →
          </button>
        )}

        {/* RESULT */}
        {submitted && (
          <div
            className={
              isCorrect
                ? "answer-feedback correct-feedback"
                : "answer-feedback incorrect-feedback"
            }
          >
            <div className="feedback-title">
              {isCorrect ? "✓ Correct Answer!" : "✕ Incorrect Answer"}
            </div>

            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      {/* BACK */}
      <div className="question-navigation">
        <Link
          to={`/questions/${category}`}
          className="back-practice-btn"
        >
          ← Back to Questions
        </Link>
      </div>
    </div>
  );
}

export default QuestionDetails;