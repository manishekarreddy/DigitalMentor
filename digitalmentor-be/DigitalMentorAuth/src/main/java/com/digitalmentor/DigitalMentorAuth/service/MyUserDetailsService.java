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
}
