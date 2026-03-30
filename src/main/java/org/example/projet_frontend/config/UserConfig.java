package org.example.projet_frontend.config;

import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserConfig {

    private final UserRepo repository;

    public UserConfig(UserRepo repository) {
        this.repository = repository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> repository.findByEmail(email)
                .map(userEntity -> org.springframework.security.core.userdetails.User
                        .withUsername(userEntity.getEmail())
                        .password(userEntity.getPassword())
                        .roles(userEntity.getRole().replace("ROLE_", ""))
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
