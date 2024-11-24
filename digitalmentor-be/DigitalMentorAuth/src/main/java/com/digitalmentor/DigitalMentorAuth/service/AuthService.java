package com.digitalmentor.DigitalMentorAuth.service;


import com.digitalmentor.DigitalMentorAuth.entity.User;
import com.digitalmentor.DigitalMentorAuth.exception.CustomException;
import com.digitalmentor.DigitalMentorAuth.model.AuthenticationResponse;
import com.digitalmentor.DigitalMentorAuth.repository.UserRepository;
import com.digitalmentor.DigitalMentorAuth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Autowired
    private JwtUtil jwtUtil;


    @Autowired
    private UserRepository userRepository;

    @Autowired private MyUserDetailsService userDetailsService;

    public AuthenticationResponse registerUser(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new CustomException("Email is already been taken", HttpStatus.BAD_REQUEST);
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true); // Set the user to active by default
        user.setRoles(List.of("ROLE_USER")); // Set the user's role to USER by default


        // Generate the JWT token

        // Save the user
        userRepository.save(user);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        // Generate the JWT token
        final String jwt = jwtUtil.generateToken(userDetails);

        User u = userRepository.findByEmail(userDetails.getUsername()).get();

        // Get additional user information like roles
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Return both JWT and user information
        return new AuthenticationResponse(jwt,user.getEmail(), roles, user.getUsername(), user.getId());
    }

}
