import React, { createContext, useContext, useReducer, useEffect } from "react";

const mockUsers = {
  student: {
    id: 1,
    name: "John Doe",
    regNumber: "UNI-2024-0123",
    program: "Computer Science",
    gpa: 3.84,
    email: "student@university.edu",
    phone: "+1234567890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    dateOfBirth: "2002-05-15",
    address: "123 University Ave, Campus City",
    semester: 6,
    enrollmentYear: 2021,
    guardianName: "Jane Doe",
    guardianPhone: "+0987654321",
    bloodGroup: "O+",
    nationality: "American",
    religion: "Christian",
    gender: "Male",
    role: "student",
  },
  faculty: {
    id: 1,
    name: "Prof. Jane Smith",
    employeeId: "EMP-2020-045",
    email: "faculty@university.edu",
    phone: "+1234567890",
    department: "Computer Science",
    designation: "Associate Professor",
    officeHours: "Mon, Wed 2:00-4:00 PM",
    officeRoom: "Faculty Block, Room 301",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "faculty",
  },
};

const AUTH_ACTIONS = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  INIT_AUTH: "INIT_AUTH",
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check localStorage
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.INIT_AUTH:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole");

        if (token && role && mockUsers[role]) {
          dispatch({
            type: AUTH_ACTIONS.INIT_AUTH,
            payload: mockUsers[role],
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.INIT_AUTH,
            payload: null,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        dispatch({
          type: AUTH_ACTIONS.INIT_AUTH,
          payload: null,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let user = null;
      if (
        credentials.email === "student@university.edu" &&
        credentials.password === "password123"
      ) {
        user = mockUsers.student;
      } else if (
        credentials.email === "faculty@university.edu" &&
        credentials.password === "password123"
      ) {
        user = mockUsers.faculty;
      }

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Store auth data
      localStorage.setItem("authToken", "mock-jwt-token-" + Date.now());
      localStorage.setItem("userRole", user.role);

      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });

      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateProfile = async (updatedData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...state.user, ...updatedData };
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: updatedUser,
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AUTH_ACTIONS };
