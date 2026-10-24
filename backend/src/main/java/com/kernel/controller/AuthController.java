package com.kernel.controller;

import com.kernel.model.User;
import com.kernel.repository.UserRepository;
import com.kernel.service.UserAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserAccountService userAccountService;

    public AuthController(UserRepository userRepository, UserAccountService userAccountService) {
        this.userRepository = userRepository;
        this.userAccountService = userAccountService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email and password are required."));
        }
        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT));
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (Boolean.TRUE.equals(user.getIsActive()) && user.getPassword().equals(password)) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "token", "demo-jwt-token-" + user.getId(),
                        "user", user
                ));
            }
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid email or password"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        if (user.getFullName() == null || user.getFullName().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Name, email, and password are required."));
        }
        user.setFullName(user.getFullName().trim());
        user.setEmail(user.getEmail().trim().toLowerCase(Locale.ROOT));
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is already registered."));
        }
        user.setRole("USER");
        user.setIsActive(true);
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "token", "demo-jwt-token-" + saved.getId(),
                "user", saved
        ));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updated) {
        return userRepository.findById(id)
                .map(existing -> {
                    if (updated.getFullName() != null) existing.setFullName(updated.getFullName());
                    if (updated.getEmail() != null && !updated.getEmail().isBlank()) {
                        String email = updated.getEmail().trim().toLowerCase(Locale.ROOT);
                        Optional<User> emailOwner = userRepository.findByEmail(email);
                        if (emailOwner.isPresent() && !emailOwner.get().getId().equals(id)) {
                            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
                        }
                        existing.setEmail(email);
                    }
                    if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
                    if (updated.getAddressLine1() != null) existing.setAddressLine1(updated.getAddressLine1());
                    if (updated.getCity() != null) existing.setCity(updated.getCity());
                    if (updated.getState() != null) existing.setState(updated.getState());
                    if (updated.getPostalCode() != null) existing.setPostalCode(updated.getPostalCode());
                    if (updated.getCountry() != null) existing.setCountry(updated.getCountry());
                    return ResponseEntity.ok(userRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/profile/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        userAccountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
