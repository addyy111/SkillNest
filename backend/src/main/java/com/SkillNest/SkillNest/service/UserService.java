package com.SkillNest.SkillNest.service;

import com.SkillNest.SkillNest.entity.User;
import com.SkillNest.SkillNest.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // ==============================
    // REGISTER
    // ==============================

    public User registerUser(User user) {

        // Check for duplicate email
        User existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            throw new RuntimeException(
                    "Email is already registered."
            );
        }

        // Always set role to STUDENT for public registration
        user.setRole("STUDENT");

        // Hash password before storing
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }


    // ==============================
    // LOGIN
    // ==============================

    public User loginUser(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        return user;
    }


    // ==============================
    // GET ALL USERS
    // ==============================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    // ==============================
    // GET USER COUNT
    // ==============================

    public long getUserCount() {
        return userRepository.count();
    }


    // ==============================
    // DELETE USER
    // ==============================

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}