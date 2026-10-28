package com.SkillNest.SkillNest.repo;

import com.SkillNest.SkillNest.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    List<TestAttempt> findByQuizIdOrderBySubmittedAtDesc(Long quizId);
    List<TestAttempt> findAllByOrderBySubmittedAtDesc();
}
