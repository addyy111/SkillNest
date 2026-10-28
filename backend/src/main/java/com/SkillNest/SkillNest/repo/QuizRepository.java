package com.SkillNest.SkillNest.repo;

import com.SkillNest.SkillNest.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}