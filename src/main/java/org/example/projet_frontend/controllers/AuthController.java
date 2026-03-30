package org.example.projet_frontend.controllers;

import org.example.projet_frontend.config.JwtUtils;
import org.example.projet_frontend.dto.AuthRequest;
import org.example.projet_frontend.dto.AuthResponse;
import org.example.projet_frontend.dto.MessageResponse;
import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @GetMapping("/ping")
    public String ping() {
        return "Backend is up!";
    }

    @Autowired
    private UserRepo repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (repository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
            if (authentication.isAuthenticated()) {
                User user = repository.findByEmail(authRequest.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                String actualRole = user.getRole();
                String requestedRole = authRequest.getRole();

                // If they request a specific role, verify if they have the rights
                String finalRole = actualRole;
                if (requestedRole != null && !requestedRole.isEmpty()) {
                    if (actualRole.equals("ROLE_ADMIN")) {
                        finalRole = requestedRole; // Admin can choose to act as User
                    } else if (requestedRole.equals("ROLE_ADMIN")) {
                        return ResponseEntity.status(401)
                                .body(new MessageResponse("Unauthorized: You do not have Admin privileges"));
                    }
                }

                String token = jwtUtils.generateToken(authRequest.getEmail(), finalRole);
                return ResponseEntity.ok(new AuthResponse(token, authRequest.getEmail(), finalRole));
            } else {
                return ResponseEntity.status(401).body(new MessageResponse("Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Invalid credentials or user not found"));
        }
    }
}
