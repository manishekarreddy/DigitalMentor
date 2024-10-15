package com.digitalmentor.DigitalMentorAuth.controller;

import com.digitalmentor.DigitalMentorAuth.entity.User;
import com.digitalmentor.DigitalMentorAuth.model.AuthenticationRequest;
import com.digitalmentor.DigitalMentorAuth.model.AuthenticationResponse;
import com.digitalmentor.DigitalMentorAuth.security.JwtUtil;
import com.digitalmentor.DigitalMentorAuth.service.MyUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthenticationResponse createAuthenticationToken(@Valid @RequestBody AuthenticationRequest authenticationRequest) throws Exception {

        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())
        );

        // Load user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());

        // Generate the JWT token
        final String jwt = jwtUtil.generateToken(userDetails);

        // Get additional user information like roles
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Return both JWT and user information
        return new AuthenticationResponse(jwt, userDetails.getUsername(), roles, userDetails.getUsername());
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userDetailsService.registerUser(user);
    }

}
