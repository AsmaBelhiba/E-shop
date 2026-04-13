package org.example.projet_frontend.config;

import org.example.projet_frontend.repositories.UserRepo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.stream.Collectors;

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
                        .authorities(userEntity.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                .collect(Collectors.toList()))
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
