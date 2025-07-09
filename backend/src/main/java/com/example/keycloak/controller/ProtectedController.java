package com.example.keycloak.controller;

import com.example.keycloak.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller for protected resources that require authentication.
 */
@RestController
@RequestMapping("/api/protected")
public class ProtectedController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProtectedController.class);

    /**
     * Get protected data - requires authentication.
     * 
     * @param authentication Spring Security authentication object
     * @return API response with protected data
     */
    @GetMapping("/data")
    public ApiResponse<Map<String, Object>> getProtectedData(Authentication authentication) {
        logger.debug("Protected data requested by: {}", authentication.getName());
        
        Map<String, Object> data = new HashMap<>();
        data.put("message", "This is protected data from the backend!");
        data.put("user", authentication.getName());
        data.put("timestamp", LocalDateTime.now().toString());
        data.put("authorities", authentication.getAuthorities());
        data.put("accessLevel", "AUTHENTICATED_USER");
        
        // Add some sample data
        Map<String, Object> sampleData = new HashMap<>();
        sampleData.put("dashboardStats", Map.of(
            "totalUsers", 1250,
            "activeUsers", 850,
            "systemHealth", "Excellent"
        ));
        sampleData.put("notifications", java.util.Arrays.asList(
            "Welcome to the Keycloak Demo Application",
            "Your authentication was successful",
            "All systems are operational"
        ));
        data.put("sampleData", sampleData);
        
        return ApiResponse.success("Protected data retrieved successfully", data);
    }

    /**
     * Get server time - requires authentication.
     * 
     * @param authentication Spring Security authentication object
     * @return API response with server time
     */
    @GetMapping("/time")
    public ApiResponse<Map<String, Object>> getServerTime(Authentication authentication) {
        logger.debug("Server time requested by: {}", authentication.getName());
        
        Map<String, Object> timeData = new HashMap<>();
        timeData.put("serverTime", LocalDateTime.now().toString());
        timeData.put("timezone", java.time.ZoneId.systemDefault().toString());
        timeData.put("requestedBy", authentication.getName());
        
        return ApiResponse.success("Server time retrieved successfully", timeData);
    }
}
