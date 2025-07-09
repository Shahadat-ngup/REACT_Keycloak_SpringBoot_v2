import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { apiConfig } from '../config';

export interface DashboardState {
  isLoading: boolean;
  data: any;
  error: string | null;
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
}

// Create singleton instance of API service
const apiService = new ApiService(apiConfig.baseURL);

// Custom hook for dashboard state management
export const useDashboardViewModel = () => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    isLoading: false,
    data: null,
    error: null,
    healthStatus: 'unknown',
  });

  const fetchData = async () => {
    try {
      setDashboardState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiService.getProtectedData();
      
      setDashboardState(prev => ({
        ...prev,
        isLoading: false,
        data: response.data,
        error: null,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch dashboard data',
      }));
    }
  };

  const checkHealth = async () => {
    try {
      const response = await apiService.healthCheck();
      setDashboardState(prev => ({
        ...prev,
        healthStatus: response.success ? 'healthy' : 'unhealthy',
      }));
    } catch (error) {
      console.error('Health check failed:', error);
      setDashboardState(prev => ({
        ...prev,
        healthStatus: 'unhealthy',
      }));
    }
  };

  const clearError = () => {
    setDashboardState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    checkHealth();
    fetchData();
  }, []);

  return {
    ...dashboardState,
    fetchData,
    checkHealth,
    clearError,
  };
};
