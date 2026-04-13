package org.example.projet_frontend.controllers;

import org.example.projet_frontend.config.JwtUtils;
import org.example.projet_frontend.dto.AuthRequest;
import org.example.projet_frontend.dto.AuthResponse;
import org.example.projet_frontend.dto.MessageResponse;
import org.example.projet_frontend.entities.Role;
import org.example.projet_frontend.entities.User;
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

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepo repository;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Backend is up!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (repository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Assign default ROLE_USER
        Role userRole = roleRepo.findByName("ROLE_USER").orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
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
                
                Set<String> roleNames = user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet());

                String requestedRole = authRequest.getRole();
                String finalRole;

                if (requestedRole != null && !requestedRole.isEmpty()) {
                    if (roleNames.contains(requestedRole)) {
                        finalRole = requestedRole;
                    } else {
                        return ResponseEntity.status(401)
                                .body(new MessageResponse("Unauthorized: You do not have " + requestedRole + " privileges"));
                    }
                } else {
                    // Default to highest role
                    if (roleNames.contains("ROLE_SUPERADMIN")) finalRole = "ROLE_SUPERADMIN";
                    else if (roleNames.contains("ROLE_ADMIN")) finalRole = "ROLE_ADMIN";
                    else finalRole = "ROLE_USER";
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
