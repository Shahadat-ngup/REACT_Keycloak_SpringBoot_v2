package com.example.keycloak.controller;

import com.example.keycloak.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for monitoring application status.
 */
@RestController
@RequestMapping("/api")
public class HealthController {
    
    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);
    
    @Value("${spring.application.name}")
    private String applicationName;

    /**
     * Health check endpoint - publicly accessible.
     * 
     * @return API response with health status
     */
    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        logger.debug("Health check requested");
        
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("application", applicationName);
        healthData.put("timestamp", System.currentTimeMillis());
        healthData.put("version", "1.0.0");
        
        return ApiResponse.success("Application is healthy", healthData);
    }
}
