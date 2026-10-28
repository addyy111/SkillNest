package com.SkillNest.SkillNest.config;

import com.SkillNest.SkillNest.entity.User;
import com.SkillNest.SkillNest.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@skillnest.com") == null) {
            User admin = new User();
            admin.setName("SkillNest Admin");
            admin.setEmail("admin@skillnest.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Default admin user initialized (admin@skillnest.com).");
        }
    }
}
