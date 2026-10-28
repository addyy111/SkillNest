package com.SkillNest.SkillNest.repo;

import com.SkillNest.SkillNest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}