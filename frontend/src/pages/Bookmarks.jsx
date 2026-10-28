import { useState } from "react";
import { Link } from "react-router-dom";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillnestBookmarks")) || [];
    } catch {
      return [];
    }
  });

  // Remove bookmark
  const removeBookmark = (bookmarkToRemove) => {
    const updatedBookmarks = bookmarks.filter(
      (bookmark) =>
        !(
          String(bookmark.id) === String(bookmarkToRemove.id) &&
          bookmark.category?.toLowerCase() === bookmarkToRemove.category?.toLowerCase()
        )
    );

    setBookmarks(updatedBookmarks);
    localStorage.setItem(
      "skillnestBookmarks",
      JSON.stringify(updatedBookmarks)
    );
  };

  return (
    <div className="bookmarks-page">
      {/* HEADER */}
      <div className="bookmarks-header">
        <div>
          <p className="bookmarks-label">SAVED QUESTIONS</p>
          <h1>My Bookmarks</h1>
          <p>Keep important questions saved for later practice.</p>
        </div>

        <Link to="/questions" className="bookmarks-practice-btn">
          Practice Questions →
        </Link>
      </div>

      {/* COUNT */}
      <div className="bookmarks-count">
        <strong>{bookmarks.length}</strong>
        <span> saved questions</span>
      </div>

      {/* BOOKMARK LIST */}
      {bookmarks.length > 0 ? (
        <div className="bookmark-list">
          {bookmarks.map((question) => (
            <div
              className="bookmark-card"
              key={`${question.category}-${question.id}`}
            >
              {/* QUESTION NUMBER */}
              <div className="bookmark-number">
                #{question.id}
              </div>

              {/* QUESTION CONTENT */}
              <div className="bookmark-content">
                <Link
                  to={`/questions/${question.category?.toLowerCase() || "java"}/${question.id}`}
                >
                  <h3>{question.title}</h3>
                </Link>

                {/* META */}
                <div className="bookmark-meta">
                  <span>{question.category}</span>
                  <span>{question.topic}</span>
                  <span
                    className={`bookmark-difficulty ${
                      question.difficulty
                        ? question.difficulty.toLowerCase()
                        : "easy"
                    }`}
                  >
                    {question.difficulty || "Easy"}
                  </span>
                </div>
              </div>

              {/* REMOVE BUTTON */}
              <button
                className="remove-bookmark-btn"
                onClick={() => removeBookmark(question)}
                title="Remove bookmark"
              >
                🔖
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bookmark-empty">
          <div className="bookmark-empty-icon">🔖</div>
          <h2>No bookmarks yet</h2>
          <p>Save questions while practicing and they will appear here.</p>

          <Link to="/questions" className="bookmarks-practice-btn">
            Start Practicing →
          </Link>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;