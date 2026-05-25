package org.example.projet_frontend.service;

import java.util.Set;

public class AuthResponse {
    private String token;
    private String email;
    private String role; // Active role
    private Set<String> roles; // All roles user possesses

    public AuthResponse() {
    }

    public AuthResponse(String token, String email, String role, Set<String> roles) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.roles = roles;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
