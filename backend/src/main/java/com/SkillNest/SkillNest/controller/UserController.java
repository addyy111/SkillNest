package com.SkillNest.SkillNest.controller;

import com.SkillNest.SkillNest.entity.User;
import com.SkillNest.SkillNest.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    // ==============================
    // REGISTER USER
    // ==============================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        try {

            User registered =
                    userService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(registered);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }


    // ==============================
    // LOGIN USER
    // ==============================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User user) {

        try {

            User loggedIn =
                    userService.loginUser(
                            user.getEmail(),
                            user.getPassword()
                    );

            return ResponseEntity.ok(loggedIn);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }


    // ==============================
    // GET ALL USERS (Admin)
    // ==============================

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }


    // ==============================
    // GET USER COUNT (Admin)
    // ==============================

    @GetMapping("/count")
    public long getUserCount() {

        return userService.getUserCount();
    }


    // ==============================
    // DELETE USER (Admin)
    // ==============================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        try {

            userService.deleteUser(id);

            return ResponseEntity.ok(
                    "User deleted successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }
    }
}