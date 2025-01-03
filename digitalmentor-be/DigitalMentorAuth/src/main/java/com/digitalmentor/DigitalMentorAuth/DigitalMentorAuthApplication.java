package com.digitalmentor.DigitalMentorAuth;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.digitalmentor.DigitalMentorAuth.repository")
@EnableWebSecurity
public class DigitalMentorAuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(DigitalMentorAuthApplication.class, args);
	}
}
