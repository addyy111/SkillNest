package com.SkillNest.SkillNest.dto;

import java.util.HashMap;
import java.util.Map;

public class TestSubmissionDTO {
    private Long studentId;
    private Map<Long, Integer> answers = new HashMap<>();
    private Integer timeTakenSeconds = 0;

    public TestSubmissionDTO() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Map<Long, Integer> getAnswers() {
        return answers != null ? answers : new HashMap<>();
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds != null ? timeTakenSeconds : 0;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }
}
