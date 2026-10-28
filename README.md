# SkillNest — Full-Stack Technical Interview & Placement Platform

SkillNest is an integrated full-stack learning platform providing technical interview question banks, real-time interactive MCQ testing, timer-based assessments, automated score evaluation, email scorecard delivery, and an administrative management portal.

---

## 1. Unified Project Structure

All frontend and backend code is now unified into a single clean root directory: `D:\SkillNest\`

```
D:\SkillNest/
├── backend/                       # Spring Boot 3.4 (Java 21/24) Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/SkillNest/SkillNest/
│   │   │   │   ├── config/        # Security, CORS & Database initialization seeders
│   │   │   │   │   ├── DataInitializer.java          (Default admin seeder)
│   │   │   │   │   ├── QuestionDataInitializer.java  (Seeds 108+ technical questions)
│   │   │   │   │   └── SecurityConfig.java           (BCrypt, CORS & endpoint security)
│   │   │   │   ├── controller/    # REST API endpoints
│   │   │   │   │   ├── QuestionController.java       (/api/questions)
│   │   │   │   │   ├── QuizController.java           (/api/quizzes)
│   │   │   │   │   └── UserController.java           (/api/users)
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   │   ├── QuestionReviewDTO.java
│   │   │   │   │   ├── TakeTestQuestionDTO.java      (Anti-cheat payload)
│   │   │   │   │   ├── TakeTestQuizDTO.java
│   │   │   │   │   ├── TestResultResponseDTO.java
│   │   │   │   │   └── TestSubmissionDTO.java
│   │   │   │   ├── entity/        # JPA Entities (Hibernate)
│   │   │   │   │   ├── Question.java
│   │   │   │   │   ├── Quiz.java
│   │   │   │   │   ├── TestAttempt.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── repo/          # Spring Data JPA Repositories
│   │   │   │   │   ├── QuestionRepository.java
│   │   │   │   │   ├── QuizRepository.java
│   │   │   │   │   ├── TestAttemptRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── service/       # Business Logic & Evaluation Engines
│   │   │   │   │   ├── EmailService.java             (HTML scorecard delivery)
│   │   │   │   │   ├── QuestionService.java
│   │   │   │   │   ├── QuizService.java
│   │   │   │   │   ├── TestAttemptService.java       (Scoring & grading engine)
│   │   │   │   │   └── UserService.java
│   │   │   │   └── SkillNestApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties            (Database credentials & port)
│   │   └── test/
│   ├── pom.xml                    # Maven dependencies
│   ├── mvnw
│   └── mvnw.cmd                   # Maven wrapper for Windows
│
├── frontend/                      # React 19 + Vite 8 Frontend
│   ├── src/
│   │   ├── assets/                # Logos, SVG icons & imagery
│   │   ├── components/            # Reusable UI components & route guards
│   │   │   ├── AdminProtectedRoute.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/                 # Application views
│   │   │   ├── AdminDashboard.jsx # Admin metrics
│   │   │   ├── AdminLogin.jsx     # Admin authentication portal
│   │   │   ├── AdminQuestions.jsx # Question bank authoring
│   │   │   ├── AdminQuizzes.jsx   # Test creator & attempts tracking
│   │   │   ├── AdminUsers.jsx     # User management table
│   │   │   ├── Bookmarks.jsx      # Student saved questions
│   │   │   ├── Dashboard.jsx      # Student home & progress
│   │   │   ├── Home.jsx           # Platform landing page
│   │   │   ├── Leaderboard.jsx    # Rankings & accuracy
│   │   │   ├── Login.jsx          # Student login
│   │   │   ├── Profile.jsx        # Account management
│   │   │   ├── QuestionDetails.jsx# Interactive MCQ solver with explanation
│   │   │   ├── QuestionList.jsx   # Category question catalog (12+ per category)
│   │   │   ├── Questions.jsx      # Domain hub (Java, Python, C++, HTML, CSS, JS, React, Node, SQL)
│   │   │   ├── Quiz.jsx           # Take Test interface with live timer & palette
│   │   │   ├── QuizResult.jsx     # Instant test results & score report
│   │   │   └── Register.jsx       # Student registration
│   │   ├── App.jsx                # Router configuration
│   │   ├── index.css              # Narvik (#EAE7DD) & Sorrell Brown (#99775C) design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── start-all.bat                  # One-click Windows batch script to launch both servers
├── start-all.ps1                  # PowerShell script to launch both servers
├── start-backend.bat              # Launch only Spring Boot backend
├── start-frontend.bat             # Launch only React Vite frontend
└── README.md                      # This project guide
```

---

## 2. Quick Start Guide

### Prerequisites
1. **Java**: JDK 21 or JDK 24 installed.
2. **Node.js**: v20+ installed.
3. **MySQL**: Running on port `3306` with database `skillnest`.

### Starting Both Servers with One Click
In the `D:\SkillNest\` folder, double-click:
```cmd
start-all.bat
```
*(Or in PowerShell run `.\start-all.ps1`)*

### Starting Servers Individually

#### Backend (Spring Boot — Port 8080)
```powershell
cd D:\SkillNest\backend
.\mvnw.cmd spring-boot:run
```

#### Frontend (Vite — Port 5173)
```powershell
cd D:\SkillNest\frontend
npm run dev -- --port 5173
```

---

## 3. Default Login Credentials

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| **Administrator** | `http://localhost:5173/admin/login` | `admin@skillnest.com` | `admin123` |
| **Student** | `http://localhost:5173/login` | Register new at `/register` or use existing student | `password123` |

---

## 4. Key Architectural Features

- **108+ Pre-Seeded Technical Questions**: 12+ real questions seeded across Java, Python, C++, HTML, CSS, JavaScript, React, Node.js, and SQL.
- **Anti-Cheat Test Delivery**: Student test queries (`GET /api/quizzes/{id}/take`) omit correct answers and explanations until submission.
- **Server-Side Evaluation**: Grades, percentages, and pass/fail statuses are computed on the backend.
- **Reliable Email Dispatch**: HTML report cards sent automatically upon submission (gracefully logs if SMTP is unconfigured).
- **Narvik & Sorrell Brown Theme**: High-contrast, warm modern palette applied consistently across student and admin portals.
