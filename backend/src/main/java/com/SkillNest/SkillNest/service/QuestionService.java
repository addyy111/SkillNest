package com.SkillNest.SkillNest.service;

import com.SkillNest.SkillNest.entity.Question;
import com.SkillNest.SkillNest.repo.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // Add Question
    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Get all questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Get question count
    public long getQuestionCount() {
        return questionRepository.count();
    }

    // Get questions by category (case-insensitive)
    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategoryIgnoreCase(category);
    }

    // Get question by ID
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    // Update question
    public Question updateQuestion(Long id, Question updatedQuestion) {
        Optional<Question> existingQuestion = questionRepository.findById(id);

        if (existingQuestion.isPresent()) {
            Question question = existingQuestion.get();
            question.setTitle(updatedQuestion.getTitle());
            question.setCategory(updatedQuestion.getCategory());
            question.setTopic(updatedQuestion.getTopic());
            question.setDifficulty(updatedQuestion.getDifficulty());
            question.setOptionA(updatedQuestion.getOptionA());
            question.setOptionB(updatedQuestion.getOptionB());
            question.setOptionC(updatedQuestion.getOptionC());
            question.setOptionD(updatedQuestion.getOptionD());
            question.setAnswer(updatedQuestion.getAnswer());
            question.setExplanation(updatedQuestion.getExplanation());
            return questionRepository.save(question);
        }

        return null;
    }

    // Delete question safely without foreign key conflicts
    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteFromQuizQuestions(id);
        questionRepository.deleteById(id);
    }
}