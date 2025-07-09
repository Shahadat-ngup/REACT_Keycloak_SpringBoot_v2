import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:8080') {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Try to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              // You would implement token refresh logic here
              // For now, we'll redirect to login
              window.location.href = '/';
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.clear();
              window.location.href = '/';
            }
          } else {
            // No refresh token, redirect to login
            localStorage.clear();
            window.location.href = '/';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<string>> {
    try {
      const response: AxiosResponse<ApiResponse<string>> = await this.api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('Health check failed');
    }
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response: AxiosResponse<ApiResponse<UserProfile>> = await this.api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  // Get protected data
  async getProtectedData(): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/api/protected/data');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch protected data');
    }
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
