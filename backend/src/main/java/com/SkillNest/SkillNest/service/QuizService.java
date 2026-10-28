package com.SkillNest.SkillNest.service;

import com.SkillNest.SkillNest.entity.Question;
import com.SkillNest.SkillNest.entity.Quiz;
import com.SkillNest.SkillNest.repo.QuestionRepository;
import com.SkillNest.SkillNest.repo.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public QuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository) {

        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    // Add Quiz
    @Transactional
    public Quiz addQuiz(Quiz quiz) {

        List<Question> questions = new ArrayList<>();

        if (quiz.getQuestions() != null) {
            for (Question question : quiz.getQuestions()) {
                if (question.getId() != null) {
                    Optional<Question> existingQuestion =
                            questionRepository.findById(question.getId());

                    existingQuestion.ifPresent(questions::add);
                }
            }
        }

        quiz.setQuestions(questions);
        if (quiz.getStatus() == null || quiz.getStatus().isBlank()) {
            quiz.setStatus("PUBLISHED");
        }
        if (quiz.getDifficulty() == null || quiz.getDifficulty().isBlank()) {
            quiz.setDifficulty("Medium");
        }

        return quizRepository.save(quiz);
    }

    // Get all quizzes (for admin)
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    // Get published quizzes (for students)
    public List<Quiz> getPublishedQuizzes() {
        List<Quiz> all = quizRepository.findAll();
        List<Quiz> published = new ArrayList<>();
        for (Quiz q : all) {
            if (q.getStatus() == null || !"DRAFT".equalsIgnoreCase(q.getStatus())) {
                published.add(q);
            }
        }
        return published;
    }

    // Get quiz by ID
    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    // Update Quiz
    @Transactional
    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {

        Optional<Quiz> existingQuiz =
                quizRepository.findById(id);

        if (existingQuiz.isPresent()) {

            Quiz quiz = existingQuiz.get();

            quiz.setTitle(updatedQuiz.getTitle());
            quiz.setCategory(updatedQuiz.getCategory());
            quiz.setDuration(updatedQuiz.getDuration());
            quiz.setDescription(updatedQuiz.getDescription());
            if (updatedQuiz.getDifficulty() != null) {
                quiz.setDifficulty(updatedQuiz.getDifficulty());
            }
            if (updatedQuiz.getTotalMarks() != null) {
                quiz.setTotalMarks(updatedQuiz.getTotalMarks());
            }
            if (updatedQuiz.getPassingMarks() != null) {
                quiz.setPassingMarks(updatedQuiz.getPassingMarks());
            }
            if (updatedQuiz.getStatus() != null) {
                quiz.setStatus(updatedQuiz.getStatus());
            }

            List<Question> questions = new ArrayList<>();

            if (updatedQuiz.getQuestions() != null) {
                for (Question question : updatedQuiz.getQuestions()) {
                    if (question.getId() != null) {
                        Optional<Question> existingQuestion =
                                questionRepository.findById(question.getId());

                        existingQuestion.ifPresent(questions::add);
                    }
                }
            }

            quiz.setQuestions(questions);

            return quizRepository.save(quiz);
        }

        return null;
    }

    // Update Quiz publication status
    @Transactional
    public Quiz updateQuizStatus(Long id, String status) {
        Optional<Quiz> existingQuiz = quizRepository.findById(id);
        if (existingQuiz.isPresent()) {
            Quiz quiz = existingQuiz.get();
            quiz.setStatus(status);
            return quizRepository.save(quiz);
        }
        return null;
    }

    // Delete Quiz
    @Transactional
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}