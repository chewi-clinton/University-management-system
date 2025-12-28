import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Mock student data
const mockStudent = {
  id: 1,
  name: 'John Doe',
  regNumber: 'UNI-2024-0123',
  program: 'Computer Science',
  gpa: 3.84,
  email: 'john.doe@university.edu',
  phone: '+1234567890',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  dateOfBirth: '2002-05-15',
  address: '123 University Ave, Campus City',
  semester: 6,
  enrollmentYear: 2021,
  guardianName: 'Jane Doe',
  guardianPhone: '+0987654321',
  bloodGroup: 'O+',
  nationality: 'American',
  religion: 'Christian',
  gender: 'Male'
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  user: mockStudent, // Using mock data for demo
  isAuthenticated: true, // Auto-login for demo
  isLoading: false,
  error: null
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: mockStudent });
      
      // Store in localStorage for demo
      localStorage.setItem('authToken', 'mock-jwt-token');
      
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    localStorage.removeItem('authToken');
  };

  // Update profile function
  const updateProfile = async (updatedData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE, payload: updatedData });
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Auto-login with mock data
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: mockStudent });
    }
  }, []);

  const value = {
    ...state,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export action types for use in components
export { AUTH_ACTIONS };