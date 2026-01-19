import { authAPI } from './api';

export const loginUser = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    
    // Save token to localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await authAPI.register(name, email, password, role);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};