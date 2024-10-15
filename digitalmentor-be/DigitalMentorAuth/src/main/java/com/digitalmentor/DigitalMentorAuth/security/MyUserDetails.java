package com.digitalmentor.DigitalMentorAuth.security;

import com.digitalmentor.DigitalMentorAuth.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class MyUserDetails implements UserDetails {

    private String email;
    private String password;
    private String username; // Assuming username is the same as email for simplicity
    private boolean active;
    private List<GrantedAuthority> authorities;

    // Constructor to initialize MyUserDetails with the User entity
    public MyUserDetails(User user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.active = user.isActive();
        this.username = user.getUsername(); // Assuming username is the same as email for simplicity
        this.authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username; // Since you're using email for authentication
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
