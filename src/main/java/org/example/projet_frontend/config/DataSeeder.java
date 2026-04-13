package org.example.projet_frontend.config;

import org.example.projet_frontend.entities.Role;
import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.repositories.RoleRepo;
import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepo repository, RoleRepo roleRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create Roles
            Role userRole = roleRepo.findByName("ROLE_USER").orElseGet(() -> roleRepo.save(new Role("ROLE_USER")));
            Role adminRole = roleRepo.findByName("ROLE_ADMIN").orElseGet(() -> roleRepo.save(new Role("ROLE_ADMIN")));
            Role superAdminRole = roleRepo.findByName("ROLE_SUPERADMIN").orElseGet(() -> roleRepo.save(new Role("ROLE_SUPERADMIN")));

            // Create SuperAdmin
            if (!repository.existsByEmail("superadmin@eshop.com")) {
                User superAdmin = new User();
                superAdmin.setEmail("superadmin@eshop.com");
                superAdmin.setPassword(passwordEncoder.encode("super123"));
                superAdmin.setFullName("Super Admin");
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                roles.add(adminRole);
                roles.add(superAdminRole);
                superAdmin.setRoles(roles);
                repository.save(superAdmin);
                System.out.println("Default super-admin user created: superadmin@eshop.com / super123");
            }

            // Create Admin
            if (!repository.existsByEmail("admin@eshop.com")) {
                User admin = new User();
                admin.setEmail("admin@eshop.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                roles.add(adminRole);
                admin.setRoles(roles);
                repository.save(admin);
                System.out.println("Default admin user created: admin@eshop.com / admin123");
            }
        };
    }
}
