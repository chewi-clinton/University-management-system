import { apiClient, createMockResponse } from './client.js';

// Mock auth service for demo
export const authService = {
  // Login method
  login: async (credentials) => {
    try {
      // For demo, we'll use mock response
      // In real app: return apiClient.post('/auth/login', credentials);
      
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'John Doe',
          email: credentials.email,
          regNumber: 'UNI-2024-0123'
        }
      };
      
      return createMockResponse(mockResponse, 800);
    } catch (error) {
      throw error;
    }
  },

  // Logout method
  logout: async () => {
    try {
      // In real app: return apiClient.post('/auth/logout');
      return createMockResponse({ message: 'Logged out successfully' }, 300);
    } catch (error) {
      throw error;
    }
  },

  // Refresh token method
  refreshToken: async () => {
    try {
      // In real app: return apiClient.post('/auth/refresh');
      const mockResponse = {
        token: 'new-mock-jwt-token-' + Date.now()
      };
      
      return createMockResponse(mockResponse, 500);
    } catch (error) {
      throw error;
    }
  },

  // Forgot password method
  forgotPassword: async (email) => {
    try {
      // In real app: return apiClient.post('/auth/forgot-password', { email });
      return createMockResponse({ 
        message: 'Password reset link sent to your email',
        email: email 
      }, 600);
    } catch (error) {
      throw error;
    }
  },

  // Reset password method
  resetPassword: async (token, newPassword) => {
    try {
      // In real app: return apiClient.post('/auth/reset-password', { token, newPassword });
      return createMockResponse({ 
        message: 'Password reset successfully' 
      }, 700);
    } catch (error) {
      throw error;
    }
  }
};