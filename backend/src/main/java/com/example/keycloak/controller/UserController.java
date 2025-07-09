package com.example.keycloak.controller;

import com.example.keycloak.dto.ApiResponse;
import com.example.keycloak.dto.UserProfileDto;
import com.example.keycloak.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for user-related operations.
 * All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get current user's profile information.
     * 
     * @param authentication Spring Security authentication object
     * @return API response with user profile data
     */
    @GetMapping("/profile")
    public ApiResponse<UserProfileDto> getUserProfile(Authentication authentication) {
        logger.debug("User profile requested for: {}", authentication.getName());
        
        try {
            UserProfileDto profile = userService.getUserProfile(authentication);
            return ApiResponse.success("User profile retrieved successfully", profile);
        } catch (Exception e) {
            logger.error("Error retrieving user profile for: {}", authentication.getName(), e);
            return ApiResponse.error("Failed to retrieve user profile");
        }
    }
}
