package org.example.projet_frontend.config;

import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepo repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!repository.existsByEmail("admin@eshop.com")) {
                User admin = new User();
                admin.setEmail("admin@eshop.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                admin.setRole("ROLE_ADMIN");
                repository.save(admin);
                System.out.println("Default admin user created: admin@eshop.com / admin123");
            }
        };
    }
}
