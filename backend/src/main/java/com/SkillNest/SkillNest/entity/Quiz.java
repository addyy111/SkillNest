package com.SkillNest.SkillNest.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String category;

    private int duration;

    private String description;

    private String difficulty = "Medium";

    private Integer totalMarks = 0;

    private Integer passingMarks = 0;

    private String status = "PUBLISHED";

    @ManyToMany
    @JoinTable(
            name = "quiz_questions",
            joinColumns = @JoinColumn(name = "quiz_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions = new ArrayList<>();

    public Quiz() {
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

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getDifficulty() {
        return difficulty != null && !difficulty.isBlank() ? difficulty : "Medium";
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getTotalMarks() {
        if (totalMarks != null && totalMarks > 0) {
            return totalMarks;
        }
        if (questions != null && !questions.isEmpty()) {
            return questions.stream()
                    .mapToInt(q -> q.getMarks() != null && q.getMarks() > 0 ? q.getMarks() : 1)
                    .sum();
        }
        return 0;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getPassingMarks() {
        if (passingMarks != null && passingMarks > 0) {
            return passingMarks;
        }
        int total = getTotalMarks();
        return (int) Math.ceil(total * 0.5);
    }

    public void setPassingMarks(Integer passingMarks) {
        this.passingMarks = passingMarks;
    }

    public String getStatus() {
        return status != null && !status.isBlank() ? status : "PUBLISHED";
    }

    public void setStatus(String status) {
        this.status = status;
    }
}