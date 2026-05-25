package org.example.projet_frontend.controllers;

import org.example.projet_frontend.entities.Role;
import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.entities.PasswordResetToken;
import org.example.projet_frontend.repositories.PasswordResetTokenRepo;
import org.example.projet_frontend.config.EmailService;
import org.example.projet_frontend.repositories.RoleRepo;
import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepo tokenRepo;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepo.findAll());
    }

    @PostMapping
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        
        // Generate a random temp password (will be replaced by user)
        user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        
        // If roles aren't specified, assign ROLE_USER by default
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role userRole = roleRepo.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role ROLE_USER not found."));
            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);
        } else {
            Set<Role> attachedRoles = new HashSet<>();
            for (Role role : user.getRoles()) {
                Role dbRole = roleRepo.findByName(role.getName())
                        .orElseThrow(() -> new RuntimeException("Error: Role " + role.getName() + " not found."));
                attachedRoles.add(dbRole);
            }
            user.setRoles(attachedRoles);
        }
        
        userRepo.save(user);

        // Generate password setup token and send email
        String token = java.util.UUID.randomUUID().toString();
        tokenRepo.save(new PasswordResetToken(token, user));
        emailService.sendPasswordSetupEmail(user.getEmail(), token);

        return ResponseEntity.ok("User created! A password setup link has been sent to their email.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<?> updateRoles(@PathVariable Long id, @RequestBody List<String> roleNames) {
        User user = userRepo.findById(id).orElseThrow();
        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepo.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found."));
            roles.add(role);
        }
        user.setRoles(roles);
        userRepo.save(user);
        return ResponseEntity.ok().build();
    }
}
