package com.SkillNest.SkillNest.repo;

import com.SkillNest.SkillNest.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByCategoryIgnoreCase(String category);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM quiz_questions WHERE question_id = :questionId", nativeQuery = true)
    void deleteFromQuizQuestions(@Param("questionId") Long questionId);
}