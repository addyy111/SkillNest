package com.SkillNest.SkillNest.controller;

import com.SkillNest.SkillNest.entity.Question;
import com.SkillNest.SkillNest.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // ADD QUESTION
    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }

    // GET ALL QUESTIONS
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // GET QUESTION COUNT
    @GetMapping("/count")
    public long getQuestionCount() {
        return questionService.getQuestionCount();
    }

    // GET QUESTIONS BY CATEGORY
    @GetMapping("/category/{category}")
    public List<Question> getQuestionsByCategory(
            @PathVariable String category) {

        return questionService.getQuestionsByCategory(category);
    }

    // GET QUESTION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(
            @PathVariable Long id) {

        Optional<Question> question =
                questionService.getQuestionById(id);

        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Question not found.");
    }

    // UPDATE QUESTION
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable Long id,
            @RequestBody Question question) {

        Question updated =
                questionService.updateQuestion(id, question);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Question not found.");
    }

    // DELETE QUESTION
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(
            @PathVariable Long id) {

        questionService.deleteQuestion(id);

        return ResponseEntity.ok(
                "Question deleted successfully"
        );
    }
}