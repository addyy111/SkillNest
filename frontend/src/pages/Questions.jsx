import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

const initialCategories = [
  {
    name: "C++",
    level: "INTERMEDIATE",
    icon: "C++",
    description: "Practice object-oriented programming, memory management and STL.",
    fallbackCount: 12,
  },
  {
    name: "Java",
    level: "INTERMEDIATE",
    icon: "☕",
    description: "Master Java fundamentals, OOP principles, and multithreading.",
    fallbackCount: 13,
  },
  {
    name: "Python",
    level: "BEGINNER",
    icon: "🐍",
    description: "Learn Python programming through practical interview questions.",
    fallbackCount: 12,
  },
  {
    name: "HTML",
    level: "BEGINNER",
    icon: "5",
    description: "Practice the fundamentals of semantic web page structure.",
    fallbackCount: 12,
  },
  {
    name: "CSS",
    level: "BEGINNER",
    icon: "#",
    description: "Test your knowledge of Flexbox, Grid, animations and responsive design.",
    fallbackCount: 12,
  },
  {
    name: "JavaScript",
    level: "INTERMEDIATE",
    icon: "JS",
    description: "Practice modern JavaScript ES6+, async/await, and event loop logic.",
    fallbackCount: 12,
  },
  {
    name: "React",
    level: "INTERMEDIATE",
    icon: "⚛",
    description: "Prepare with React components, hooks, state, and reconciliation.",
    fallbackCount: 12,
  },
  {
    name: "Node.js",
    level: "INTERMEDIATE",
    icon: "⬡",
    description: "Practice server-side JavaScript, event loops, buffers and Express APIs.",
    fallbackCount: 12,
  },
  {
    name: "SQL",
    level: "INTERMEDIATE",
    icon: "DB",
    description: "Improve relational database queries, JOINs, indexing, and transactions.",
    fallbackCount: 12,
  },
];

function Questions() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/questions`);
        const questions = response.data || [];
        const tally = {};
        questions.forEach((q) => {
          const cat = q.category ? q.category.toLowerCase() : "";
          tally[cat] = (tally[cat] || 0) + 1;
        });
        setCounts(tally);
      } catch (err) {
        console.warn("Could not fetch live counts, using defaults:", err);
      }
    };

    fetchCounts();
  }, []);

  const getQuestionCount = (categoryName, fallback) => {
    const key = categoryName.toLowerCase();
    return counts[key] !== undefined ? counts[key] : fallback;
  };

  const categories = initialCategories.map((c) => ({
    ...c,
    questions: getQuestionCount(c.name, c.fallbackCount),
  }));

  return (
    <div className="practice-page">
      {/* Page Header */}
      <div className="practice-header">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <strong>Practice</strong>
        </div>

        <span className="section-label">CODING PRACTICE</span>
        <h1>Build Skills Through Practice</h1>
        <p>
          Practice technical interview questions across popular programming languages,
          frameworks, and databases.
        </p>
      </div>

      {/* Core Programming */}
      <PracticeSection
        title="CORE PROGRAMMING"
        items={categories.slice(0, 3)}
      />

      {/* Web Development */}
      <PracticeSection
        title="WEB DEVELOPMENT"
        items={categories.slice(3, 7)}
      />

      {/* Backend & Database */}
      <PracticeSection
        title="BACKEND & DATABASE"
        items={categories.slice(7, 9)}
      />
    </div>
  );
}

/* Reusable Section */
function PracticeSection({ title, items }) {
  return (
    <section className="practice-section">
      <div className="practice-section-title">{title}</div>

      <div className="practice-grid">
        {items.map((category) => (
          <Link
            to={`/questions/${category.name.toLowerCase()}`}
            className="practice-card"
            key={category.name}
          >
            <div className="language-icon">{category.icon}</div>

            <div className="practice-card-content">
              <div className="practice-card-title">
                <h3>{category.name}</h3>
                <span className="difficulty">{category.level}</span>
              </div>

              <p>{category.description}</p>

              <div className="question-count">
                {category.questions} Questions →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Questions;