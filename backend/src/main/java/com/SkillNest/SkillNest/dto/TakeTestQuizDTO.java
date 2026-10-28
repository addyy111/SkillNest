package com.SkillNest.SkillNest.dto;

import com.SkillNest.SkillNest.entity.Quiz;

import java.util.List;
import java.util.stream.Collectors;

public class TakeTestQuizDTO {
    private Long id;
    private String title;
    private String category;
    private int duration;
    private String description;
    private String difficulty;
    private Integer totalMarks;
    private Integer passingMarks;
    private List<TakeTestQuestionDTO> questions;

    public TakeTestQuizDTO() {
    }

    public static TakeTestQuizDTO fromQuiz(Quiz quiz) {
        TakeTestQuizDTO dto = new TakeTestQuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setCategory(quiz.getCategory());
        dto.setDuration(quiz.getDuration());
        dto.setDescription(quiz.getDescription());
        dto.setDifficulty(quiz.getDifficulty());
        dto.setTotalMarks(quiz.getTotalMarks());
        dto.setPassingMarks(quiz.getPassingMarks());
        if (quiz.getQuestions() != null) {
            dto.setQuestions(quiz.getQuestions().stream()
                    .map(TakeTestQuestionDTO::fromQuestion)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getPassingMarks() {
        return passingMarks;
    }

    public void setPassingMarks(Integer passingMarks) {
        this.passingMarks = passingMarks;
    }

    public List<TakeTestQuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<TakeTestQuestionDTO> questions) {
        this.questions = questions;
    }
}
