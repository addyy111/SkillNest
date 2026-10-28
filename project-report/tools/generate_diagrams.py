"""
generate_diagrams.py - High resolution diagram generator for SkillNest Mini Project Report
Generates:
1. Figure 3.1: Object Diagram (Runtime objects: u1: User, q1: Quiz, qn1: Question, ta1: TestAttempt)
2. Figure 3.2: Class Diagram (Domain entities: User, Quiz, Question, TestAttempt, join table)
3. Figure 3.3: Use Case Diagram (Actors: Student, Admin, System/Email Engine; Use cases)
4. Figure 3.4: Sequence Diagram (Student -> React -> QuizController -> TestAttemptService -> EmailService -> DB)
5. Figure 3.5: Activity Diagram (Test taking, countdown, validation, grading, scorecard dispatch)
6. Figure 3.6: Module Hierarchy Diagram (Core platform decomposed into 4 functional tiers)
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Use non-interactive backend
plt.switch_backend('Agg')

DIAGRAMS_DIR = r"D:\SkillNest\project-report\diagrams"
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

# Common styling palette
PRIMARY_BLUE = "#1e3a8a"    # Dark navy blue
ACCENT_BLUE = "#2563eb"     # Royal blue
LIGHT_BG = "#f8fafc"        # Very light slate
BOX_BG = "#ffffff"          # White
BORDER_COLOR = "#1e3a8a"
TEXT_COLOR = "#0f172a"
SECONDARY_TEXT = "#475569"
PASS_COLOR = "#16a34a"
WARN_COLOR = "#d97706"

def create_object_diagram():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=300)
    ax.set_xlim(0, 1200)
    ax.set_ylim(0, 650)
    ax.axis('off')
    
    # Title
    ax.text(600, 620, "Figure 3.1: SkillNest Runtime Object Diagram", 
            ha='center', va='center', fontsize=14, fontweight='bold', color=PRIMARY_BLUE)
    
    # Helper to draw object box
    def draw_obj(x, y, w, h, header_text, body_lines):
        # Header rect
        rect_head = patches.FancyBboxPatch((x, y + h - 35), w, 35, boxstyle="round,pad=0,rounding_size=4",
                                          facecolor=PRIMARY_BLUE, edgecolor=PRIMARY_BLUE, lw=1.5)
        ax.add_patch(rect_head)
        ax.text(x + w/2, y + h - 17.5, header_text, ha='center', va='center', 
                fontsize=10, fontweight='bold', color='white')
        
        # Body rect
        rect_body = patches.FancyBboxPatch((x, y), w, h - 35, boxstyle="round,pad=0,rounding_size=4",
                                          facecolor=LIGHT_BG, edgecolor=BORDER_COLOR, lw=1.5)
        ax.add_patch(rect_body)
        
        # Body text
        cur_y = y + h - 50
        for line in body_lines:
            ax.text(x + 15, cur_y, line, ha='left', va='center', fontsize=8.5, color=TEXT_COLOR, fontfamily='monospace')
            cur_y -= 18

    # Objects
    # u1 : User
    draw_obj(50, 380, 320, 180, "u1 : User", [
        "id = 101",
        "name = 'Aditya Narwade'",
        "email = 'aditya@mitwpu.edu'",
        "role = 'STUDENT'",
        "password = '$2a$10$e8Z...'"
    ])

    # ta1 : TestAttempt
    draw_obj(450, 380, 340, 190, "ta1 : TestAttempt", [
        "id = 5001",
        "student_id = 101",
        "quiz_id = 201",
        "score = 18",
        "total_marks = 20",
        "percentage = 90.0",
        "passed = true",
        "email_status = 'SENT'"
    ])

    # q1 : Quiz
    draw_obj(850, 380, 300, 180, "q1 : Quiz", [
        "id = 201",
        "title = 'Java OOP & Streams'",
        "category = 'Java'",
        "duration = 30",
        "total_marks = 20",
        "passing_marks = 10",
        "status = 'PUBLISHED'"
    ])

    # qn1 : Question
    draw_obj(250, 80, 320, 200, "qn1 : Question", [
        "id = 1001",
        "title = 'Which collection is thread-safe?'",
        "category = 'Java'",
        "topic = 'Collections'",
        "difficulty = 'Medium'",
        "answer = 2 (ConcurrentHashMap)",
        "marks = 1"
    ])

    # qn2 : Question
    draw_obj(650, 80, 320, 200, "qn2 : Question", [
        "id = 1002",
        "title = 'What is JVM memory structure?'",
        "category = 'Java'",
        "topic = 'JVM Architecture'",
        "difficulty = 'Hard'",
        "answer = 1 (Heap and Stack)",
        "marks = 1"
    ])

    # Relationships / links
    def draw_link(x1, y1, x2, y2, label):
        ax.plot([x1, x2], [y1, y2], color=ACCENT_BLUE, lw=1.5)
        ax.text((x1+x2)/2, (y1+y2)/2 + 10, label, ha='center', va='bottom', 
                fontsize=8, fontweight='bold', color=ACCENT_BLUE, backgroundcolor='white')

    draw_link(370, 470, 450, 470, "submits")
    draw_link(790, 470, 850, 470, "evaluates")
    draw_link(950, 380, 850, 280, "contains")
    draw_link(950, 380, 450, 280, "contains")

    plt.tight_layout()
    out_path = os.path.join(DIAGRAMS_DIR, "figure_3_1_object_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved:", out_path)

def create_class_diagram():
    fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
    ax.set_xlim(0, 1300)
    ax.set_ylim(0, 800)
    ax.axis('off')

    ax.text(650, 775, "Figure 3.2: SkillNest Domain Class Diagram", 
            ha='center', va='center', fontsize=14, fontweight='bold', color=PRIMARY_BLUE)

    def draw_class(x, y, w, h, class_name, attrs, methods):
        # Header
        rect_head = patches.FancyBboxPatch((x, y + h - 35), w, 35, boxstyle="round,pad=0,rounding_size=4",
                                          facecolor=PRIMARY_BLUE, edgecolor=PRIMARY_BLUE, lw=1.5)
        ax.add_patch(rect_head)
        ax.text(x + w/2, y + h - 17.5, class_name, ha='center', va='center', 
                fontsize=10, fontweight='bold', color='white')

        # Body
        rect_body = patches.FancyBboxPatch((x, y), w, h - 35, boxstyle="round,pad=0,rounding_size=4",
                                          facecolor=BOX_BG, edgecolor=BORDER_COLOR, lw=1.5)
        ax.add_patch(rect_body)

        cur_y = y + h - 50
        for attr in attrs:
            ax.text(x + 10, cur_y, attr, ha='left', va='center', fontsize=8, color=TEXT_COLOR, fontfamily='monospace')
            cur_y -= 15
        
        # Separator line
        ax.plot([x, x + w], [cur_y, cur_y], color="#cbd5e1", lw=1)
        cur_y -= 12

        for method in methods:
            ax.text(x + 10, cur_y, method, ha='left', va='center', fontsize=8, color=ACCENT_BLUE, fontfamily='monospace')
            cur_y -= 15

    # User Entity
    draw_class(40, 460, 260, 260, "User", [
        "- id: Long [PK]",
        "- name: String",
        "- email: String [UNIQUE]",
        "- password: String (BCrypt)",
        "- role: String (STUDENT/ADMIN)"
    ], [
        "+ getId(): Long",
        "+ getName(): String",
        "+ getEmail(): String",
        "+ getRole(): String"
    ])

    # Quiz Entity
    draw_class(480, 440, 310, 290, "Quiz", [
        "- id: Long [PK]",
        "- title: String",
        "- category: String",
        "- duration: int (Minutes)",
        "- description: String",
        "- difficulty: String",
        "- totalMarks: int",
        "- passingMarks: int",
        "- status: String (DRAFT/PUB)"
    ], [
        "+ getQuestions(): Set<Question>",
        "+ computeTotalMarks(): void",
        "+ computePassingMarks(): void"
    ])

    # Question Entity
    draw_class(940, 440, 320, 300, "Question", [
        "- id: Long [PK]",
        "- title: String",
        "- category: String",
        "- topic: String",
        "- difficulty: String",
        "- optionA: String",
        "- optionB: String",
        "- optionC: String",
        "- optionD: String",
        "- answer: int (0-3)",
        "- marks: int = 1"
    ], [
        "+ getAnswer(): int",
        "+ getExplanation(): String"
    ])

    # TestAttempt Entity
    draw_class(260, 60, 340, 310, "TestAttempt", [
        "- id: Long [PK]",
        "- student: User [FK, ManyToOne]",
        "- quiz: Quiz [FK, ManyToOne]",
        "- score: int",
        "- totalMarks: int",
        "- percentage: double",
        "- passed: boolean",
        "- correctCount: int",
        "- incorrectCount: int",
        "- unansweredCount: int",
        "- timeTakenSeconds: int",
        "- submittedAt: LocalDateTime",
        "- emailStatus: String",
        "- answersJson: String (TEXT)"
    ], [
        "+ evaluateScore(): void",
        "+ isPassing(): boolean",
        "+ getAnswersMap(): Map"
    ])

    # Join Table Box
    draw_class(750, 140, 260, 180, "quiz_questions (Join)", [
        "- quiz_id: Long [FK -> Quiz]",
        "- question_id: Long [FK -> Qn]"
    ], [
        "Multiplicity: Many-to-Many",
        "Cascade: Join table lookup"
    ])

    # Multiplicity lines
    def draw_rel(x1, y1, x2, y2, label1, label2, text):
        ax.plot([x1, x2], [y1, y2], color=PRIMARY_BLUE, lw=1.5)
        ax.text(x1, y1 + 10, label1, fontsize=8, fontweight='bold', color=PRIMARY_BLUE)
        ax.text(x2, y2 + 10, label2, fontsize=8, fontweight='bold', color=PRIMARY_BLUE)
        ax.text((x1+x2)/2, (y1+y2)/2 + 10, text, ha='center', va='bottom', 
                fontsize=8, color=ACCENT_BLUE, backgroundcolor='white')

    draw_rel(300, 560, 480, 560, "1", "0..*", "has attempts")
    draw_rel(790, 560, 940, 560, "*", "*", "contains")
    draw_rel(170, 460, 300, 370, "1", "*", "owns")
    draw_rel(580, 440, 500, 370, "1", "*", "attempted on")

    plt.tight_layout()
    out_path = os.path.join(DIAGRAMS_DIR, "figure_3_2_class_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved:", out_path)

def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 1200)
    ax.set_ylim(0, 750)
    ax.axis('off')

    ax.text(600, 725, "Figure 3.3: SkillNest Use Case Diagram", 
            ha='center', va='center', fontsize=14, fontweight='bold', color=PRIMARY_BLUE)

    # System boundary box
    sys_rect = patches.FancyBboxPatch((280, 50), 640, 640, boxstyle="round,pad=0,rounding_size=10",
                                     facecolor="#f1f5f9", edgecolor=PRIMARY_BLUE, lw=2, linestyle='--')
    ax.add_patch(sys_rect)
    ax.text(600, 670, "SkillNest Application Boundary", ha='center', va='center', 
            fontsize=11, fontweight='bold', color=PRIMARY_BLUE)

    # Actor: Student
    def draw_actor(x, y, name):
        # Head
        circle = patches.Circle((x, y + 40), 15, facecolor='white', edgecolor=PRIMARY_BLUE, lw=2)
        ax.add_patch(circle)
        # Body
        ax.plot([x, x], [y + 25, y - 10], color=PRIMARY_BLUE, lw=2)
        # Arms
        ax.plot([x - 20, x + 20], [y + 15, y + 15], color=PRIMARY_BLUE, lw=2)
        # Legs
        ax.plot([x, x - 15], [y - 10, y - 35], color=PRIMARY_BLUE, lw=2)
        ax.plot([x, x + 15], [y - 10, y - 35], color=PRIMARY_BLUE, lw=2)
        # Name
        ax.text(x, y - 50, name, ha='center', va='center', fontsize=10, fontweight='bold', color=PRIMARY_BLUE)

    draw_actor(120, 480, "Student / Candidate")
    draw_actor(120, 200, "Administrator")
    draw_actor(1070, 350, "JavaMail / SMTP\nEngine")

    # Use Cases (Ellipses)
    use_cases = [
        (600, 620, "UC-01: Register & Login (Student)"),
        (600, 550, "UC-02: Browse Technical Question Hub (9 Categories)"),
        (600, 480, "UC-03: Practice MCQs & View Explanations"),
        (600, 410, "UC-04: Take Timed Technical Assessment (Anti-Cheat)"),
        (600, 340, "UC-05: Review Instant Scorecard & Correct Answers"),
        (600, 270, "UC-06: Bookmark Questions for Revision"),
        (600, 200, "UC-07: Manage Question Bank (CRUD) - Admin"),
        (600, 130, "UC-08: Create & Publish Tests - Admin"),
        (600, 70,  "UC-09: Monitor Attempts & System Users - Admin")
    ]

    for (cx, cy, label) in use_cases:
        ellipse = patches.Ellipse((cx, cy), 380, 42, facecolor='white', edgecolor=ACCENT_BLUE, lw=1.5)
        ax.add_patch(ellipse)
        ax.text(cx, cy, label, ha='center', va='center', fontsize=8.5, fontweight='bold', color=TEXT_COLOR)

    # Actor connections
    student_cases = [620, 550, 480, 410, 340, 270]
    for uc_y in student_cases:
        ax.plot([145, 410], [480, uc_y], color="#94a3b8", lw=1.2)

    admin_cases = [200, 130, 70]
    for uc_y in admin_cases:
        ax.plot([145, 410], [200, uc_y], color="#94a3b8", lw=1.2)

    # Mail connection
    ax.plot([790, 1030], [340, 350], color=PASS_COLOR, lw=1.5, linestyle=':')
    ax.text(910, 360, "dispatches HTML scorecard", ha='center', va='bottom', 
            fontsize=7.5, color=PASS_COLOR, fontweight='bold')

    plt.tight_layout()
    out_path = os.path.join(DIAGRAMS_DIR, "figure_3_3_use_case_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved:", out_path)

def create_sequence_diagram():
    fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
    ax.set_xlim(0, 1300)
    ax.set_ylim(0, 800)
    ax.axis('off')

    ax.text(650, 775, "Figure 3.4: SkillNest Sequence Diagram — Test Submission & Automated Grading", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=PRIMARY_BLUE)

    lifelines = [
        (150, "Student"),
        (380, "React Client (Quiz.jsx)"),
        (620, "QuizController"),
        (850, "TestAttemptService"),
        (1080, "MySQL DB & JavaMail")
    ]

    for (x, name) in lifelines:
        # Box
        rect = patches.FancyBboxPatch((x - 85, 710), 170, 38, boxstyle="round,pad=0,rounding_size=4",
                                     facecolor=PRIMARY_BLUE, edgecolor=PRIMARY_BLUE, lw=1.5)
        ax.add_patch(rect)
        ax.text(x, 729, name, ha='center', va='center', fontsize=8.5, fontweight='bold', color='white')
        # Dashed line
        ax.plot([x, x], [710, 70], color="#94a3b8", linestyle='--', lw=1.2)

    messages = [
        (150, 380, 660, "1: Click 'Submit Assessment' / Timer Expired", False),
        (380, 620, 600, "2: POST /api/quizzes/{id}/submit (TestSubmissionDTO)", False),
        (620, 850, 540, "3: submitTestAttempt(quizId, submissionDTO)", False),
        (850, 1080, 480, "4: SELECT questions FROM quiz WHERE id = {id}", False),
        (1080, 850, 430, "5: Return actual Questions with Correct Answers", True),
        (850, 850, 370, "6: Self-call: Evaluate score, marks & pass/fail status", False),
        (850, 1080, 310, "7: INSERT INTO test_attempt (...) COMMIT", False),
        (850, 1080, 250, "8: sendScorecardEmail(student, attempt, quiz)", False),
        (850, 620, 190, "9: Return TestResultResponseDTO with detailed reviews", True),
        (620, 380, 140, "10: HTTP 200 OK (Scorecard, Questions & Explanations)", True),
        (380, 150, 90,  "11: Render QuizResult.jsx HUD with full performance breakdown", True)
    ]

    for (x1, x2, y, text, is_reply) in messages:
        if x1 == x2: # self call
            ax.plot([x1, x1 + 50, x1 + 50, x1], [y + 15, y + 15, y - 10, y - 10], color=WARN_COLOR, lw=1.5)
            ax.annotate("", xy=(x1, y - 10), xytext=(x1 + 15, y - 10),
                        arrowprops=dict(arrowstyle="->", color=WARN_COLOR, lw=1.5))
            ax.text(x1 + 60, y + 2, text, ha='left', va='center', fontsize=8, color=WARN_COLOR, fontweight='bold')
        else:
            style = '--' if is_reply else '-'
            color = PASS_COLOR if is_reply else ACCENT_BLUE
            ax.plot([x1, x2], [y, y], color=color, linestyle=style, lw=1.5)
            ax.annotate("", xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", color=color, lw=1.5))
            ax.text((x1 + x2)/2, y + 7, text, ha='center', va='bottom', 
                    fontsize=8, color=color, fontweight='bold', backgroundcolor='white')

    plt.tight_layout()
    out_path = os.path.join(DIAGRAMS_DIR, "figure_3_4_sequence_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved:", out_path)

def create_activity_diagram():
    fig, ax = plt.subplots(figsize=(10, 9), dpi=300)
    ax.set_xlim(0, 1000)
    ax.set_ylim(0, 900)
    ax.axis('off')

    ax.text(500, 875, "Figure 3.5: SkillNest Activity Diagram — Test Taking & Automated Grading Workflow", 
            ha='center', va='center', fontsize=12, fontweight='bold', color=PRIMARY_BLUE)

    # Start Node
    start = patches.Circle((500, 830), 16, facecolor=PRIMARY_BLUE, edgecolor=PRIMARY_BLUE)
    ax.add_patch(start)

    def draw_act(x, y, w, h, text):
        rect = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0,rounding_size=8",
                                     facecolor=LIGHT_BG, edgecolor=BORDER_COLOR, lw=1.5)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color=TEXT_COLOR)

    def draw_decision(x, y, w, h, text):
        # Diamond
        poly = patches.Polygon([(x, y + h/2), (x + w/2, y), (x, y - h/2), (x - w/2, y)],
                               facecolor="#fef3c7", edgecolor="#b45309", lw=1.5)
        ax.add_patch(poly)
        ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='bold', color="#78350f")

    def draw_arr(x1, y1, x2, y2, label=""):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="-|>", color=PRIMARY_BLUE, lw=1.5))
        if label:
            ax.text((x1+x2)/2 + 10, (y1+y2)/2, label, fontsize=8, fontweight='bold', color=ACCENT_BLUE)

    draw_arr(500, 814, 500, 770)
    draw_act(500, 750, 420, 38, "Select Published Test & Read Instructions")

    draw_arr(500, 731, 500, 690)
    draw_act(500, 670, 440, 38, "Fetch Questions via Anti-Cheat Endpoint (/api/quizzes/{id}/take)")

    draw_arr(500, 651, 500, 610)
    draw_act(500, 590, 420, 38, "Start Countdown Timer & Render Question Palette")

    draw_arr(500, 571, 500, 530)
    draw_act(500, 510, 420, 38, "Navigate, Select Answers, Flag Questions for Review")

    draw_arr(500, 491, 500, 440)
    draw_decision(500, 410, 180, 60, "Timer Expired or\nUser Submitted?")

    # Decision branches
    draw_arr(500, 380, 500, 330, "Yes")
    draw_act(500, 310, 440, 38, "Assemble TestSubmissionDTO & POST to /api/quizzes/{id}/submit")

    draw_arr(500, 291, 500, 250)
    draw_act(500, 230, 440, 38, "Backend Compares Answers, Computes Score & Pass/Fail Status")

    draw_arr(500, 211, 500, 170)
    draw_act(500, 150, 440, 38, "Save TestAttempt Record & Trigger JavaMail HTML Scorecard")

    draw_arr(500, 131, 500, 90)
    draw_act(500, 70, 440, 38, "Display QuizResult.jsx with Explanations & Review")

    draw_arr(500, 51, 500, 25)
    # End node (bullseye)
    end_outer = patches.Circle((500, 15), 15, facecolor='white', edgecolor=PRIMARY_BLUE, lw=1.5)
    end_inner = patches.Circle((500, 15), 9, facecolor=PRIMARY_BLUE, edgecolor=PRIMARY_BLUE)
    ax.add_patch(end_outer)
    ax.add_patch(end_inner)

    plt.tight_layout()
    out_path = os.path.join(DIAGRAMS_DIR, "figure_3_5_activity_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved:", out_path)

def create_module_hierarchy_diagram():
    fig, ax = plt.subplots(figsize=(13, 7.5), dpi=300)
    ax.set_xlim(0, 1300)
    ax.set_ylim(0, 750)
    ax.axis('off')

    ax.text(650, 725, "Figure 3.6: SkillNest Functional Module Hierarchy", 
            ha='center', va='center', fontsize=14, fontweight='bold', color=PRIMARY_BLUE)

    def draw_box(x, y, w, h, title, subtitle="", bg=PRIMARY_BLUE, text_c="white"):
        rect = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0,rounding_size=6",
                                     facecolor=bg, edgecolor=PRIMARY_BLUE, lw=1.5)
        ax.add_patch(rect)
        if subtitle:
            ax.text(x, y + 8, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_c)
            ax.text(x, y - 10, subtitle, ha='center', va='center', fontsize=7.5, color=text_c)
        else:
            ax.text(x, y, title, ha='center', va='center', fontsize=10, fontweight='bold', color=text_c)

    # Root Level
    draw_box(650, 640, 420, 50, "SkillNest Technical Interview Platform", "Core System Architecture")

    # Tier 1 Modules
    tier1 = [
        (180, 500, "1.0 Security & Identity", "BCrypt Hashing, Role Guards"),
        (490, 500, "2.0 Student Portal", "Question Hub, MCQs, Bookmarks"),
        (800, 500, "3.0 Assessment Engine", "Timed Tests, Anti-Cheat, Grading"),
        (1110, 500, "4.0 Administration", "CRUD Questions, Quizzes, Users")
    ]

    for (x, y, title, sub) in tier1:
        draw_box(x, y, 270, 55, title, sub, bg="#1e40af", text_c="white")
        # Line from root to tier 1
        ax.plot([650, x], [615, 528], color=PRIMARY_BLUE, lw=1.5)

    # Tier 2 Sub-modules
    tier2 = [
        # Under 1.0
        (180, 390, "1.1 User Auth API", "/register, /login endpoints"),
        (180, 310, "1.2 Route Guards", "ProtectedRoute & AdminGuards"),
        (180, 230, "1.3 BCrypt Encoder", "Password hashing security"),
        # Under 2.0
        (490, 390, "2.1 9-Domain Hub", "Java, Python, C++, HTML, SQL..."),
        (490, 310, "2.2 Practice Solver", "Option select, instant reveal"),
        (490, 230, "2.3 Bookmarks & Demo HUD", "localStorage progress save"),
        # Under 3.0
        (800, 390, "3.1 Timed Test HUD", "Countdown timer, question palette"),
        (800, 310, "3.2 Anti-Cheat Endpoint", "TakeTestQuestionDTO (strips ans)"),
        (800, 230, "3.3 Evaluation & Mail", "TestAttemptService, JavaMail"),
        # Under 4.0
        (1110, 390, "4.1 Question Bank Admin", "Modal CRUD, 108+ seed bank"),
        (1110, 310, "4.2 Quiz Manager", "Draft/Publish, question attach"),
        (1110, 230, "4.3 User & Attempts Audit", "Student directory & score audits")
    ]

    for (x, y, title, sub) in tier2:
        draw_box(x, y, 260, 46, title, sub, bg=LIGHT_BG, text_c=TEXT_COLOR)
        # Vertical connector
        ax.plot([x, x], [y + 45, y + 23], color=ACCENT_BLUE, lw=1.2)

    plt.tight_layout()
    out_path = os.path.join(DIAGRAMS_DIR, "figure_3_6_module_hierarchy.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved:", out_path)

if __name__ == "__main__":
    create_object_diagram()
    create_class_diagram()
    create_use_case_diagram()
    create_sequence_diagram()
    create_activity_diagram()
    create_module_hierarchy_diagram()
    print("All 6 diagrams generated successfully!")

