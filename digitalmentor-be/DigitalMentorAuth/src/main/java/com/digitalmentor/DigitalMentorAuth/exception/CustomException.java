package com.digitalmentor.DigitalMentorAuth.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CustomException extends RuntimeException {

    private final String message;
    private final HttpStatus status;
    private final String errorCode;

    // Constructor with custom message and HTTP status
    public CustomException(String message, HttpStatus status) {
        super(message);
        this.message = message;
        this.status = status;
        this.errorCode = null; // Optional, in case you don't have specific error codes
    }

    // Constructor with custom message, HTTP status, and custom error code
    public CustomException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.message = message;
        this.status = status;
        this.errorCode = errorCode;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    @Component
    public static class CustomAccessDeniedHandler implements AccessDeniedHandler {

        @Override
        public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
            // Set the response status and content type
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            // Create your custom error message
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Well, Well, look whose trying to be sneaky");
            body.put("status", HttpStatus.FORBIDDEN.value());
            body.put("errorCode", "AUTH_002");

            // Write the body to the response
            ObjectMapper mapper = new ObjectMapper();
            response.getWriter().write(mapper.writeValueAsString(body));
        }
    }
}