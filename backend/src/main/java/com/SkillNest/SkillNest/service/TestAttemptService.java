package com.SkillNest.SkillNest.service;

import com.SkillNest.SkillNest.dto.QuestionReviewDTO;
import com.SkillNest.SkillNest.dto.TestResultResponseDTO;
import com.SkillNest.SkillNest.dto.TestSubmissionDTO;
import com.SkillNest.SkillNest.entity.Question;
import com.SkillNest.SkillNest.entity.Quiz;
import com.SkillNest.SkillNest.entity.TestAttempt;
import com.SkillNest.SkillNest.entity.User;
import com.SkillNest.SkillNest.repo.QuizRepository;
import com.SkillNest.SkillNest.repo.TestAttemptRepository;
import com.SkillNest.SkillNest.repo.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TestAttemptService {

    private final TestAttemptRepository testAttemptRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    public TestAttemptService(
            TestAttemptRepository testAttemptRepository,
            QuizRepository quizRepository,
            UserRepository userRepository,
            EmailService emailService) {
        this.testAttemptRepository = testAttemptRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public TestResultResponseDTO submitTest(Long quizId, TestSubmissionDTO submission) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) {
            throw new IllegalArgumentException("Test not found with ID: " + quizId);
        }

        Quiz quiz = quizOpt.get();

        Optional<User> studentOpt = userRepository.findById(submission.getStudentId());
        if (studentOpt.isEmpty()) {
            throw new IllegalArgumentException("Student not found with ID: " + submission.getStudentId());
        }

        User student = studentOpt.get();
        Map<Long, Integer> submittedAnswers = submission.getAnswers();

        int score = 0;
        int totalMarks = 0;
        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;

        List<QuestionReviewDTO> reviews = new ArrayList<>();

        if (quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                int qMarks = q.getMarks() != null && q.getMarks() > 0 ? q.getMarks() : 1;
                totalMarks += qMarks;

                Integer selected = submittedAnswers != null ? submittedAnswers.get(q.getId()) : null;
                boolean isUnanswered = (selected == null);
                boolean isCorrect = !isUnanswered && (selected == q.getAnswer());

                if (isUnanswered) {
                    unansweredCount++;
                } else if (isCorrect) {
                    correctCount++;
                    score += qMarks;
                } else {
                    incorrectCount++;
                }

                QuestionReviewDTO review = new QuestionReviewDTO();
                review.setId(q.getId());
                review.setTitle(q.getTitle());
                review.setCategory(q.getCategory());
                review.setTopic(q.getTopic());
                review.setDifficulty(q.getDifficulty());
                review.setMarks(qMarks);
                review.setOptionA(q.getOptionA());
                review.setOptionB(q.getOptionB());
                review.setOptionC(q.getOptionC());
                review.setOptionD(q.getOptionD());
                review.setSelectedAnswer(selected);
                review.setCorrectAnswer(q.getAnswer());
                review.setCorrect(isCorrect);
                review.setUnanswered(isUnanswered);
                review.setExplanation(q.getExplanation());

                reviews.add(review);
            }
        }

        if (totalMarks == 0) {
            totalMarks = quiz.getTotalMarks() > 0 ? quiz.getTotalMarks() : 1;
        }

        double percentage = Math.round(((double) score / totalMarks) * 10000.0) / 100.0;
        int requiredPassing = quiz.getPassingMarks();
        boolean passed = score >= requiredPassing;

        String answersJson = "";
        try {
            answersJson = objectMapper.writeValueAsString(submittedAnswers != null ? submittedAnswers : Collections.emptyMap());
        } catch (Exception ignored) {
        }

        TestAttempt attempt = new TestAttempt();
        attempt.setStudent(student);
        attempt.setQuiz(quiz);
        attempt.setScore(score);
        attempt.setTotalMarks(totalMarks);
        attempt.setPercentage(percentage);
        attempt.setPassed(passed);
        attempt.setCorrectCount(correctCount);
        attempt.setIncorrectCount(incorrectCount);
        attempt.setUnansweredCount(unansweredCount);
        attempt.setTimeTakenSeconds(submission.getTimeTakenSeconds());
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setEmailStatus("PENDING");
        attempt.setAnswersJson(answersJson);

        TestAttempt savedAttempt = testAttemptRepository.save(attempt);

        // Send email result (safe, handles unconfigured SMTP gracefully)
        try {
            emailService.sendTestResultEmail(savedAttempt);
        } catch (Exception ignored) {
        }

        TestResultResponseDTO response = new TestResultResponseDTO();
        response.setAttemptId(savedAttempt.getId());
        response.setStudentId(student.getId());
        response.setStudentName(student.getName());
        response.setStudentEmail(student.getEmail());
        response.setQuizId(quiz.getId());
        response.setQuizTitle(quiz.getTitle());
        response.setScore(score);
        response.setTotalMarks(totalMarks);
        response.setPercentage(percentage);
        response.setPassed(passed);
        response.setPassingMarks(requiredPassing);
        response.setCorrectCount(correctCount);
        response.setIncorrectCount(incorrectCount);
        response.setUnansweredCount(unansweredCount);
        response.setTimeTakenSeconds(submission.getTimeTakenSeconds());
        response.setSubmittedAt(savedAttempt.getSubmittedAt());
        response.setEmailStatus(savedAttempt.getEmailStatus());
        response.setReviews(reviews);

        return response;
    }

    public List<TestAttempt> getStudentAttempts(Long studentId) {
        return testAttemptRepository.findByStudentIdOrderBySubmittedAtDesc(studentId);
    }

    public List<TestAttempt> getAllAttempts() {
        return testAttemptRepository.findAllByOrderBySubmittedAtDesc();
    }

    public TestResultResponseDTO getAttemptDetails(Long attemptId, Long requestingUserId, boolean isAdmin) {
        Optional<TestAttempt> attemptOpt = testAttemptRepository.findById(attemptId);
        if (attemptOpt.isEmpty()) {
            return null;
        }

        TestAttempt attempt = attemptOpt.get();

        // Enforce student authorization
        if (!isAdmin && (requestingUserId == null || !attempt.getStudent().getId().equals(requestingUserId))) {
            throw new SecurityException("Unauthorized access to test attempt");
        }

        Map<Long, Integer> submittedAnswers = new HashMap<>();
        try {
            if (attempt.getAnswersJson() != null && !attempt.getAnswersJson().isBlank()) {
                submittedAnswers = objectMapper.readValue(attempt.getAnswersJson(), new TypeReference<Map<Long, Integer>>() {});
            }
        } catch (Exception ignored) {
        }

        Quiz quiz = attempt.getQuiz();
        List<QuestionReviewDTO> reviews = new ArrayList<>();

        if (quiz != null && quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                int qMarks = q.getMarks() != null && q.getMarks() > 0 ? q.getMarks() : 1;
                Integer selected = submittedAnswers.get(q.getId());
                boolean isUnanswered = (selected == null);
                boolean isCorrect = !isUnanswered && (selected == q.getAnswer());

                QuestionReviewDTO review = new QuestionReviewDTO();
                review.setId(q.getId());
                review.setTitle(q.getTitle());
                review.setCategory(q.getCategory());
                review.setTopic(q.getTopic());
                review.setDifficulty(q.getDifficulty());
                review.setMarks(qMarks);
                review.setOptionA(q.getOptionA());
                review.setOptionB(q.getOptionB());
                review.setOptionC(q.getOptionC());
                review.setOptionD(q.getOptionD());
                review.setSelectedAnswer(selected);
                review.setCorrectAnswer(q.getAnswer());
                review.setCorrect(isCorrect);
                review.setUnanswered(isUnanswered);
                review.setExplanation(q.getExplanation());

                reviews.add(review);
            }
        }

        TestResultResponseDTO response = new TestResultResponseDTO();
        response.setAttemptId(attempt.getId());
        response.setStudentId(attempt.getStudent().getId());
        response.setStudentName(attempt.getStudent().getName());
        response.setStudentEmail(attempt.getStudent().getEmail());
        response.setQuizId(quiz != null ? quiz.getId() : null);
        response.setQuizTitle(quiz != null ? quiz.getTitle() : "Unknown Test");
        response.setScore(attempt.getScore());
        response.setTotalMarks(attempt.getTotalMarks());
        response.setPercentage(attempt.getPercentage());
        response.setPassed(attempt.isPassed());
        response.setPassingMarks(quiz != null ? quiz.getPassingMarks() : 0);
        response.setCorrectCount(attempt.getCorrectCount());
        response.setIncorrectCount(attempt.getIncorrectCount());
        response.setUnansweredCount(attempt.getUnansweredCount());
        response.setTimeTakenSeconds(attempt.getTimeTakenSeconds());
        response.setSubmittedAt(attempt.getSubmittedAt());
        response.setEmailStatus(attempt.getEmailStatus());
        response.setReviews(reviews);

        return response;
    }
}
