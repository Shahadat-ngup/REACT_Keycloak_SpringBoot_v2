package com.example.keycloak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * Main Spring Boot application class for Keycloak OAuth2 integration demo.
 * 
 * This application demonstrates:
 * - OAuth2 Resource Server configuration with Keycloak
 * - CORS configuration for React frontend
 * - JWT token validation
 * - Protected REST endpoints
 * 
 * @author Keycloak Demo
 * @version 1.0.0
 */
@SpringBootApplication
@EnableMethodSecurity(prePostEnabled = true)
public class KeycloakDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(KeycloakDemoApplication.class, args);
    }
}
