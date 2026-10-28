import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            ✦ SMART INTERVIEW PREPARATION
          </div>

          <h1>
            Prepare Smarter.
            <br />
            <span>Crack Your Interview.</span>
          </h1>

          <p>
            Build your technical skills with coding practice,
            quizzes, progress tracking and personalized preparation.
          </p>

          <div className="hero-buttons">

            <Link to="/questions" className="primary-btn">
              Start Practicing →
            </Link>

            <Link to="/take-test" className="secondary-btn">
              Take Test
            </Link>

          </div>

          <div className="hero-info">
            <span>✓ Coding Questions</span>
            <span>✓ Timed Tests</span>
            <span>✓ Progress Tracking</span>
          </div>

        </div>

      </section>


      {/* Features */}

      <section className="features-section">

        <div className="section-heading">

          <span>WHY SKILLNEST?</span>

          <h2>
            Everything you need to
            <br />
            prepare with confidence.
          </h2>

          <p>
            Practice consistently, understand your weaknesses,
            and improve your interview readiness.
          </p>

        </div>


        <div className="features-grid">

          <FeatureCard
            icon="⌨"
            title="Coding Practice"
            description="Practice programming questions across Java, Python, C++, JavaScript, SQL and more."
          />

          <FeatureCard
            icon="✓"
            title="Timed Tests"
            description="Test your skills with category-based MCQ tests and timed placement assessments."
          />

          <FeatureCard
            icon="↗"
            title="Track Progress"
            description="Monitor your scores, attempts, accuracy and improvement over time."
          />

          <FeatureCard
            icon="★"
            title="Bookmarks"
            description="Save important questions and revisit them whenever you need."
          />

          <FeatureCard
            icon="♛"
            title="Leaderboard"
            description="Compare your test performance with other SkillNest learners."
          />

          <FeatureCard
            icon="✦"
            title="Smart Recommendations"
            description="Get personalized practice recommendations based on your performance."
          />

        </div>

      </section>


      {/* Statistics */}

      <section className="stats-section">

        <div className="stat">
          <h2>500+</h2>
          <p>Practice Questions</p>
        </div>

        <div className="stat">
          <h2>50+</h2>
          <p>Skill Tests</p>
        </div>

        <div className="stat">
          <h2>10+</h2>
          <p>Skill Categories</p>
        </div>

        <div className="stat">
          <h2>24/7</h2>
          <p>Learning Access</p>
        </div>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <div>

          <span>READY TO LEVEL UP?</span>

          <h2>
            Your next interview
            <br />
            starts with practice.
          </h2>

          <p>
            Start practicing today and build the confidence
            you need for your technical interview.
          </p>

          <Link to="/register" className="primary-btn">
            Create Free Account →
          </Link>

        </div>

      </section>


      {/* Footer */}

      <footer className="footer">

        <div className="footer-brand">

          <h2>
            <span className="logo-icon">S</span>
            SkillNest
          </h2>

          <p>
            A smart interview preparation platform
            designed to help students build technical skills.
          </p>

        </div>


        <div className="footer-column">

          <h4>Practice</h4>

          <Link to="/questions">Coding Questions</Link>
          <Link to="/take-test">Take Test</Link>
          <Link to="/dashboard">Progress</Link>

        </div>


        <div className="footer-column">

          <h4>SkillNest</h4>

          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/register">Register</Link>

        </div>


        <div className="footer-column">

          <h4>Support</h4>

          <a href="#">Help Center</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>

        </div>

      </footer>

    </div>
  );
}

export default Home;