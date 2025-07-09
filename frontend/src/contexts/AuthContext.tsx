import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { KeycloakAuthService } from '../services/authService';
import { ApiService, UserProfile } from '../services/apiService';
import { keycloakConfig, apiConfig } from '../config';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: (code: string, state: string) => Promise<void>;
  clearError: () => void;
}

// Create singleton instances of services
const authService = new KeycloakAuthService(keycloakConfig);
const apiService = new ApiService(apiConfig.baseURL);

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const response = await apiService.getUserProfile();
      return response.data;
    } catch (error) {
      // If API call fails, try to get user info from ID token
      const userInfo = authService.getUserInfo();
      if (userInfo) {
        return {
          id: userInfo.sub,
          username: userInfo.preferred_username,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
        };
      }
      return null;
    }
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        const userProfile = await fetchUserProfile();
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: userProfile,
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Failed to check authentication status',
      });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await authService.initiateLogin();
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate login';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Logout failed',
      });
    }
  };

  const handleCallback = async (code: string, state: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await authService.handleCallback(code, state);
      const userProfile = await fetchUserProfile();
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userProfile,
        error: null,
      });
    } catch (error) {
      console.error('Callback handling error:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Authentication failed',
      });
      throw error; // Re-throw to let CallbackPage handle navigation
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    handleCallback,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Keep the old hook for backward compatibility, but it now uses the context
export const useAuthViewModel = () => {
  return useAuth();
};
