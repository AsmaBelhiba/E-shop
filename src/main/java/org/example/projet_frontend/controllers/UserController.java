package org.example.projet_frontend.controllers;

import org.example.projet_frontend.entities.Role;
import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.repositories.RoleRepo;
import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepo.findAll());
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
