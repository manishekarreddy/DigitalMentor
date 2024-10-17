package com.digitalmentor.DigitalMentorAuth.security;

import com.digitalmentor.DigitalMentorAuth.exception.CustomException;
import com.digitalmentor.DigitalMentorAuth.exception.GlobalExceptionHandler;
import com.digitalmentor.DigitalMentorAuth.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {


    // Configure the password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Autowired
    private GlobalExceptionHandler.CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    private CustomException.CustomAccessDeniedHandler customAccessDeniedHandler;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    // AuthenticationManager for authenticating users (useful for @Autowired injection in controllers)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/login", "/register").permitAll() // Allow unauthenticated access to these endpoints
                        .anyRequest().authenticated() // All other requests need authentication
                )
                .authenticationProvider(authenticationProvider).exceptionHandling(customizer -> customizer
                        .authenticationEntryPoint(new GlobalExceptionHandler.CustomAuthenticationEntryPoint()) // Custom auth exception
                        .accessDeniedHandler(new CustomException.CustomAccessDeniedHandler()) // Custom access denied exception
                ).addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Inject custom UserDetailsService or any custom authentication logic
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
}


