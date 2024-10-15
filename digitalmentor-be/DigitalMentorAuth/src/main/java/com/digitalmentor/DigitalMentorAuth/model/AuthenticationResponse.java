package com.digitalmentor.DigitalMentorAuth.model;

import java.util.List;

public class AuthenticationResponse {
    private final String jwt;
    private final String email;
    private final List<String> roles;
    private final String username;

    public AuthenticationResponse(String jwt, String email, List<String> roles, String username) {
        this.jwt = jwt;
        this.email = email;
        this.roles = roles;
        this.username = username;
    }

    public String getJwt() {
        return jwt;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getRoles() {
        return roles;
    }
}
