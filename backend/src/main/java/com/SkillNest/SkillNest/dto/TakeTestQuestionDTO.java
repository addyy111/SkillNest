package com.SkillNest.SkillNest.dto;

import com.SkillNest.SkillNest.entity.Question;

public class TakeTestQuestionDTO {
    private Long id;
    private String title;
    private String category;
    private String topic;
    private String difficulty;
    private Integer marks;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    public TakeTestQuestionDTO() {
    }

    public static TakeTestQuestionDTO fromQuestion(Question q) {
        TakeTestQuestionDTO dto = new TakeTestQuestionDTO();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setCategory(q.getCategory());
        dto.setTopic(q.getTopic());
        dto.setDifficulty(q.getDifficulty());
        dto.setMarks(q.getMarks());
        dto.setOptionA(q.getOptionA());
        dto.setOptionB(q.getOptionB());
        dto.setOptionC(q.getOptionC());
        dto.setOptionD(q.getOptionD());
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

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }
}
