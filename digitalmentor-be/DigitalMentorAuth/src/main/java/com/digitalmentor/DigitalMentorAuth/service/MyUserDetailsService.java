package com.digitalmentor.DigitalMentorAuth.service;

import com.digitalmentor.DigitalMentorAuth.entity.User;
import com.digitalmentor.DigitalMentorAuth.repository.UserRepository;
import com.digitalmentor.DigitalMentorAuth.security.MyUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class MyUserDetailsService implements UserDetailsService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        user.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new MyUserDetails(user.get());
    }

    public User registerUser(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken");
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true); // Set the user to active by default
        user.setRoles(List.of("ROLE_USER")); // Set the user's role to USER by default

        // Save the user
        User savedUser = userRepository.save(user);

        // Optionally, return additional user details as needed
        return savedUser;
    }
}
