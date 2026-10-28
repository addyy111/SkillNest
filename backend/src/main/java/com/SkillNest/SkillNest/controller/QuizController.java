package com.SkillNest.SkillNest.controller;

import com.SkillNest.SkillNest.dto.TakeTestQuizDTO;
import com.SkillNest.SkillNest.dto.TestResultResponseDTO;
import com.SkillNest.SkillNest.dto.TestSubmissionDTO;
import com.SkillNest.SkillNest.entity.Quiz;
import com.SkillNest.SkillNest.entity.TestAttempt;
import com.SkillNest.SkillNest.service.QuizService;
import com.SkillNest.SkillNest.service.TestAttemptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class QuizController {

    private final QuizService quizService;
    private final TestAttemptService testAttemptService;

    public QuizController(QuizService quizService, TestAttemptService testAttemptService) {
        this.quizService = quizService;
        this.testAttemptService = testAttemptService;
    }

    // ADD TEST (Admin)
    @PostMapping
    public ResponseEntity<Quiz> addQuiz(@RequestBody Quiz quiz) {
        Quiz saved = quizService.addQuiz(quiz);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET ALL TESTS (Admin panel)
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // GET PUBLISHED TESTS (Student catalog)
    @GetMapping("/published")
    public List<Quiz> getPublishedQuizzes() {
        return quizService.getPublishedQuizzes();
    }

    // GET TEST BY ID (Admin preview/edit)
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable Long id) {
        Optional<Quiz> quiz = quizService.getQuizById(id);

        if (quiz.isPresent()) {
            return ResponseEntity.ok(quiz.get());
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Test not found.");
    }

    // GET TEST FOR STUDENT TAKE TEST (Anti-cheat: omits answer & explanation)
    @GetMapping("/{id}/take")
    public ResponseEntity<?> getQuizForTaking(@PathVariable Long id) {
        Optional<Quiz> quizOpt = quizService.getQuizById(id);

        if (quizOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Test not found.");
        }

        Quiz quiz = quizOpt.get();
        if ("DRAFT".equalsIgnoreCase(quiz.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This test is not currently published.");
        }

        TakeTestQuizDTO dto = TakeTestQuizDTO.fromQuiz(quiz);
        return ResponseEntity.ok(dto);
    }

    // UPDATE TEST (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuiz(
            @PathVariable Long id,
            @RequestBody Quiz quiz) {

        Quiz updated = quizService.updateQuiz(id, quiz);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Test not found.");
    }

    // UPDATE PUBLICATION STATUS (Admin: DRAFT vs PUBLISHED)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody) {
        String status = statusBody.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body("Status is required (DRAFT or PUBLISHED)");
        }

        Quiz updated = quizService.updateQuizStatus(id, status.toUpperCase());
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Test not found.");
    }

    // DELETE TEST (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.ok("Test deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Test not found.");
        }
    }

    // SUBMIT TEST (Student)
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitTest(
            @PathVariable Long id,
            @RequestBody TestSubmissionDTO submission) {
        try {
            TestResultResponseDTO result = testAttemptService.submitTest(id, submission);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing test submission: " + e.getMessage());
        }
    }

    // GET STUDENT ATTEMPTS
    @GetMapping("/attempts/student/{studentId}")
    public List<TestAttempt> getStudentAttempts(@PathVariable Long studentId) {
        return testAttemptService.getStudentAttempts(studentId);
    }

    // GET ALL ATTEMPTS (Admin)
    @GetMapping("/attempts")
    public List<TestAttempt> getAllAttempts() {
        return testAttemptService.getAllAttempts();
    }

    // GET ATTEMPT DETAILS WITH REVIEWS
    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<?> getAttemptDetails(
            @PathVariable Long attemptId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false, defaultValue = "false") boolean isAdmin) {
        try {
            TestResultResponseDTO details = testAttemptService.getAttemptDetails(attemptId, studentId, isAdmin);
            if (details == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Attempt not found");
            }
            return ResponseEntity.ok(details);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}