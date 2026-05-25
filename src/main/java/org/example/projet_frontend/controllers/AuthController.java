package org.example.projet_frontend.controllers;

import org.example.projet_frontend.config.EmailService;
import org.example.projet_frontend.config.JwtUtils;
import org.example.projet_frontend.service.AuthRequest;
import org.example.projet_frontend.service.AuthResponse;
import org.example.projet_frontend.service.MessageResponse;
import org.example.projet_frontend.entities.PasswordResetToken;
import org.example.projet_frontend.entities.Role;
import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.repositories.PasswordResetTokenRepo;
import org.example.projet_frontend.repositories.RoleRepo;
import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UserRepo repository;
    @Autowired private RoleRepo roleRepo;
    @Autowired private PasswordResetTokenRepo tokenRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private EmailService emailService;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Backend is up!");
    }

    /**
     * Step 1: User registers with name + email only.
     * A password-setup email is sent automatically.
     */
    @PostMapping("/register")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String fullName = body.get("fullName");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is required."));
        }
        if (repository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create user with a temporary locked password
        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // temp password

        Role userRole = roleRepo.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        repository.save(user);

        // Generate password setup token and send email
        String token = UUID.randomUUID().toString();
        tokenRepo.deleteByUserId(user.getId()); // clear any old tokens
        tokenRepo.save(new PasswordResetToken(token, user));
        emailService.sendPasswordSetupEmail(email, token);

        return ResponseEntity.ok(new MessageResponse("Account created! Check your email to set your password."));
    }

    /**
     * Step 2: User clicks link in email → sets their password.
     */
    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestParam String token, @RequestBody Map<String, String> body) {
        String newPassword = body.get("password");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(new MessageResponse("Password must be at least 6 characters."));
        }

        PasswordResetToken resetToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token."));

        if (resetToken.isExpired()) {
            tokenRepo.delete(resetToken);
            return ResponseEntity.badRequest().body(new MessageResponse("Token has expired. Please register again."));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
        tokenRepo.delete(resetToken);

        return ResponseEntity.ok(new MessageResponse("Password set successfully! You can now log in."));
    }

    /**
     * Validate a token without consuming it (used by frontend to check if token is valid).
     */
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        return tokenRepo.findByToken(token)
                .map(t -> t.isExpired()
                        ? ResponseEntity.badRequest().body(new MessageResponse("Token expired."))
                        : ResponseEntity.ok(new MessageResponse("Valid")))
                .orElse(ResponseEntity.badRequest().body(new MessageResponse("Invalid token.")));
    }

    /**
     * Login: email + password. Role auto-determined by highest privilege.
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
            if (authentication.isAuthenticated()) {
                User user = repository.findByEmail(authRequest.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                Set<String> roleNames = user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet());

                // Auto-select highest role
                String finalRole;
                if (roleNames.contains("ROLE_SUPERADMIN")) finalRole = "ROLE_SUPERADMIN";
                else if (roleNames.contains("ROLE_ADMIN")) finalRole = "ROLE_ADMIN";
                else finalRole = "ROLE_USER";

                String token = jwtUtils.generateToken(authRequest.getEmail(), finalRole);
                return ResponseEntity.ok(new AuthResponse(token, authRequest.getEmail(), finalRole, roleNames));
            } else {
                return ResponseEntity.status(401).body(new MessageResponse("Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Invalid credentials or user not found"));
        }
    }
}
