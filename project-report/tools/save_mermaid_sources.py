"""
save_mermaid_sources.py - Saves the Mermaid definitions for all diagrams in project-report/diagrams
"""
import os

DIAGRAMS_DIR = r"D:\SkillNest\project-report\diagrams"

mermaid_files = {
    "figure_3_1_object_diagram.mmd": """classDiagram
    class u1_User {
        id = 101
        name = "Aditya Narwade"
        email = "aditya@mitwpu.edu"
        role = "STUDENT"
        password = "$2a$10$e8Z..."
    }
    class ta1_TestAttempt {
        id = 5001
        student_id = 101
        quiz_id = 201
        score = 18
        total_marks = 20
        percentage = 90.0
        passed = true
        email_status = "SENT"
    }
    class q1_Quiz {
        id = 201
        title = "Java OOP & Streams"
        category = "Java"
        duration = 30
        total_marks = 20
        passing_marks = 10
        status = "PUBLISHED"
    }
    class qn1_Question {
        id = 1001
        title = "Which collection is thread-safe?"
        category = "Java"
        topic = "Collections"
        difficulty = "Medium"
        answer = 2 (ConcurrentHashMap)
        marks = 1
    }
    class qn2_Question {
        id = 1002
        title = "What is JVM memory structure?"
        category = "Java"
        topic = "JVM Architecture"
        difficulty = "Hard"
        answer = 1 (Heap and Stack)
        marks = 1
    }

    u1_User --> ta1_TestAttempt : submits
    ta1_TestAttempt --> q1_Quiz : evaluates
    q1_Quiz --> qn1_Question : contains
    q1_Quiz --> qn2_Question : contains
""",

    "figure_3_2_class_diagram.mmd": """classDiagram
    class User {
        -Long id
        -String name
        -String email
        -String password
        -String role
        +getId() Long
        +getName() String
        +getEmail() String
        +getRole() String
    }
    class Quiz {
        -Long id
        -String title
        -String category
        -int duration
        -String description
        -String difficulty
        -int totalMarks
        -int passingMarks
        -String status
        -Set~Question~ questions
        +getQuestions() Set~Question~
        +computeTotalMarks() void
        +computePassingMarks() void
    }
    class Question {
        -Long id
        -String title
        -String category
        -String topic
        -String difficulty
        -String optionA
        -String optionB
        -String optionC
        -String optionD
        -int answer
        -String explanation
        -int marks
        +getAnswer() int
        +getExplanation() String
    }
    class TestAttempt {
        -Long id
        -User student
        -Quiz quiz
        -int score
        -int totalMarks
        -double percentage
        -boolean passed
        -int correctCount
        -int incorrectCount
        -int unansweredCount
        -int timeTakenSeconds
        -LocalDateTime submittedAt
        -String emailStatus
        -String answersJson
        +evaluateScore() void
        +isPassing() boolean
        +getAnswersMap() Map
    }

    User "1" <-- "*" TestAttempt : owns
    Quiz "1" <-- "*" TestAttempt : records
    Quiz "*" <--> "*" Question : quiz_questions (Join)
""",

    "figure_3_3_use_case_diagram.mmd": """flowchart LR
    subgraph SystemBoundary ["SkillNest Application Boundary"]
        UC1(["UC-01: Register & Authenticate (Student)"])
        UC2(["UC-02: Browse Technical Hub (9 Categories)"])
        UC3(["UC-03: Practice MCQs & View Explanations"])
        UC4(["UC-04: Take Timed Test (Anti-Cheat)"])
        UC5(["UC-05: Review Instant Scorecard & Analytics"])
        UC6(["UC-06: Bookmark Questions for Revision"])
        UC7(["UC-07: Manage Question Bank (CRUD)"])
        UC8(["UC-08: Create & Publish Tests"])
        UC9(["UC-09: Monitor Attempts & Students"])
    end

    Student(["Student / Candidate"]) --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6

    Admin(["Administrator"]) --> UC7
    Admin --> UC8
    Admin --> UC9

    UC4 -.-> MailServer(["JavaMail / SMTP Service"])
    UC5 -.-> MailServer
""",

    "figure_3_4_sequence_diagram.mmd": """sequenceDiagram
    actor Student
    participant React as React Client (Quiz.jsx)
    participant Ctrl as QuizController (/api/quizzes)
    participant Svc as TestAttemptService
    participant DB as MySQL Database
    participant Mail as JavaMail / SMTP

    Student->>React: 1. Click "Submit Test" or Timer Expires
    React->>Ctrl: 2. POST /api/quizzes/{id}/submit (TestSubmissionDTO)
    Ctrl->>Svc: 3. submitTestAttempt(quizId, submissionDTO)
    Svc->>DB: 4. SELECT questions FROM quiz WHERE id = {id}
    DB-->>Svc: 5. Return Quiz with real Answers & Marks
    Note over Svc: 6. Compare answers, calculate score,<br/>percentage, and pass/fail status
    Svc->>DB: 7. INSERT INTO test_attempt (...)
    DB-->>Svc: 8. Transaction Committed (201 Created)
    Svc->>Mail: 9. sendScorecardEmail(student, attempt, quiz)
    Mail-->>Svc: 10. Email Status (SENT / NOT_CONFIGURED)
    Svc-->>Ctrl: 11. Return TestResultResponseDTO with reviews
    Ctrl-->>React: 12. HTTP 200 OK (Scorecard, Questions & Explanations)
    React-->>Student: 13. Render QuizResult.jsx Performance HUD
""",

    "figure_3_5_activity_diagram.mmd": """flowchart TD
    Start([Start Test Session]) --> SelectQuiz[Select Published Test & Review Instructions]
    SelectQuiz --> FetchAntiCheat[Fetch Stripped Questions via /take Anti-Cheat API]
    FetchAntiCheat --> StartTimer[Initialize Live Countdown Timer & Palette]
    StartTimer --> AnswerQ[Navigate Questions, Select Options, Flag for Review]
    AnswerQ --> CheckTime{Time Expired or Manual Submit?}
    CheckTime -- No --> AnswerQ
    CheckTime -- Yes --> PostSubmit[POST TestSubmissionDTO to /submit]
    PostSubmit --> Grade[Server Evaluates Answers against Database Keys]
    Grade --> Persist[Persist TestAttempt Entity with Metrics]
    Persist --> TriggerMail[Dispatch HTML Scorecard Email via SMTP]
    TriggerMail --> RenderResult[Display Instant Scorecard, Analysis & Explanations]
    RenderResult --> EndNode([Session Complete])
""",

    "figure_3_6_module_hierarchy.mmd": """flowchart TD
    Root["SkillNest Platform Core Architecture"]

    Mod1["1.0 Security & Identity Management"]
    Mod2["2.0 Student Learning & Practice Portal"]
    Mod3["3.0 Assessment & Anti-Cheat Engine"]
    Mod4["4.0 Administrative Operations & Content CMS"]

    Root --> Mod1
    Root --> Mod2
    Root --> Mod3
    Root --> Mod4

    Mod1 --> M1_1["1.1 User Auth API (/register, /login)"]
    Mod1 --> M1_2["1.2 Route Guards (ProtectedRoute, AdminGuard)"]
    Mod1 --> M1_3["1.3 BCrypt Salted Password Hashing"]

    Mod2 --> M2_1["2.1 9-Domain Question Hub (Java, Python, SQL...)"]
    Mod2 --> M2_2["2.2 Interactive MCQ Practice & Explanations"]
    Mod2 --> M2_3["2.3 LocalStorage Bookmarks & Demo Progress"]

    Mod3 --> M3_1["3.1 Timed Assessment HUD & Navigation Palette"]
    Mod3 --> M3_2["3.2 Anti-Cheat DTO Sanitizer (/take endpoint)"]
    Mod3 --> M3_3["3.3 Automated Scoring Engine & Email Dispatcher"]

    Mod4 --> M4_1["4.1 Question Bank Management (CRUD & Seeder)"]
    Mod4 --> M4_2["4.2 Quiz Builder & Publish/Draft State Toggling"]
    Mod4 --> M4_3["4.3 User Directory & Test Attempt Audits"]
"""
}

for filename, content in mermaid_files.items():
    filepath = os.path.join(DIAGRAMS_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved: {filepath}")

print("All Mermaid source files saved successfully!")

