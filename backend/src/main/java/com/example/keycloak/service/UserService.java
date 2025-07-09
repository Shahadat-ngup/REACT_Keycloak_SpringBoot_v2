package com.example.keycloak.service;

import com.example.keycloak.dto.UserProfileDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service for handling user-related operations.
 * Extracts user information from JWT tokens provided by Keycloak.
 */
@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    /**
     * Extracts user profile information from the JWT token.
     * 
     * @param authentication The Spring Security authentication object
     * @return UserProfileDto containing user information
     */
    public UserProfileDto getUserProfile(Authentication authentication) {
        logger.debug("Extracting user profile from authentication: {}", authentication.getName());
        
        if (!(authentication.getPrincipal() instanceof Jwt)) {
            throw new IllegalArgumentException("Authentication principal is not a JWT token");
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        
        UserProfileDto profile = new UserProfileDto();
        
        // Extract basic user information
        profile.setId(jwt.getClaimAsString("sub"));
        profile.setUsername(jwt.getClaimAsString("preferred_username"));
        profile.setEmail(jwt.getClaimAsString("email"));
        profile.setFirstName(jwt.getClaimAsString("given_name"));
        profile.setLastName(jwt.getClaimAsString("family_name"));
        
        // Extract roles
        Set<String> roles = extractRoles(jwt);
        profile.setRoles(roles);
        
        logger.debug("Extracted user profile: {}", profile);
        
        return profile;
    }

    /**
     * Extracts roles from JWT token.
     * Keycloak can store roles in different claims depending on configuration.
     * 
     * @param jwt The JWT token
     * @return Set of role names
     */
    private Set<String> extractRoles(Jwt jwt) {
        Set<String> roles = new HashSet<>();
        
        try {
            // Try to get roles from 'roles' claim (custom claim)
            List<String> rolesList = jwt.getClaimAsStringList("roles");
            if (rolesList != null) {
                roles.addAll(rolesList);
            }
            
            // Try to get roles from 'realm_access' claim (Keycloak default)
            Object realmAccess = jwt.getClaim("realm_access");
            if (realmAccess instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> realmAccessMap = (java.util.Map<String, Object>) realmAccess;
                Object realmRoles = realmAccessMap.get("roles");
                if (realmRoles instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> realmRolesList = (List<String>) realmRoles;
                    roles.addAll(realmRolesList);
                }
            }
            
            // Try to get roles from 'resource_access' claim (Keycloak client roles)
            Object resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> resourceAccessMap = (java.util.Map<String, Object>) resourceAccess;
                for (Object clientAccess : resourceAccessMap.values()) {
                    if (clientAccess instanceof java.util.Map) {
                        @SuppressWarnings("unchecked")
                        java.util.Map<String, Object> clientAccessMap = (java.util.Map<String, Object>) clientAccess;
                        Object clientRoles = clientAccessMap.get("roles");
                        if (clientRoles instanceof List) {
                            @SuppressWarnings("unchecked")
                            List<String> clientRolesList = (List<String>) clientRoles;
                            roles.addAll(clientRolesList);
                        }
                    }
                }
            }
            
            logger.debug("Extracted roles from JWT: {}", roles);
            
        } catch (Exception e) {
            logger.warn("Error extracting roles from JWT token: {}", e.getMessage());
        }
        
        return roles;
    }

    /**
     * Checks if the user has a specific role.
     * 
     * @param authentication The Spring Security authentication object
     * @param role The role to check for
     * @return true if user has the role, false otherwise
     */
    public boolean hasRole(Authentication authentication, String role) {
        UserProfileDto profile = getUserProfile(authentication);
        return profile.getRoles() != null && profile.getRoles().contains(role);
    }
}
