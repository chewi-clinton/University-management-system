import React, { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/api/authService";

const AUTH_ACTIONS = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  INIT_AUTH: "INIT_AUTH",
  UPDATE_USER: "UPDATE_USER",
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
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
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
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
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userRole = localStorage.getItem("userRole");

        if (token && userRole) {
          // Fetch current user data from API
          const { success, data, error } = await authService.getCurrentUser();

          if (success && data) {
            // Fetch role-specific profile data
            let profileData = null;

            if (data.role === "student") {
              const studentResult = await authService.getStudentProfile(
                data.id
              );
              if (studentResult.success) {
                profileData = studentResult.data;
              }
            } else if (data.role === "faculty") {
              const facultyResult = await authService.getFacultyProfile(
                data.id
              );
              if (facultyResult.success) {
                profileData = facultyResult.data;
              }
            }

            // Merge user data with profile data
            const completeUserData = {
              ...data,
              ...profileData,
              name:
                data.first_name && data.last_name
                  ? `${data.first_name} ${data.last_name}`
                  : data.email,
            };

            dispatch({
              type: AUTH_ACTIONS.INIT_AUTH,
              payload: completeUserData,
            });
          } else {
            // Token invalid or expired
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("userRole");
            dispatch({
              type: AUTH_ACTIONS.INIT_AUTH,
              payload: null,
            });
          }
        } else {
          dispatch({
            type: AUTH_ACTIONS.INIT_AUTH,
            payload: null,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userRole");
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
      // Call login API
      const { success, data, error } = await authService.login(credentials);

      if (!success) {
        throw new Error(error || "Login failed");
      }

      // Store tokens
      if (data.access) {
        localStorage.setItem("access_token", data.access);
      }
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }
      if (data.user?.role) {
        localStorage.setItem("userRole", data.user.role);
      }

      // Fetch complete user profile
      let completeUserData = { ...data.user };

      if (data.user.role === "student") {
        const studentResult = await authService.getStudentProfile(data.user.id);
        if (studentResult.success) {
          completeUserData = { ...completeUserData, ...studentResult.data };
        }
      } else if (data.user.role === "faculty") {
        const facultyResult = await authService.getFacultyProfile(data.user.id);
        if (facultyResult.success) {
          completeUserData = { ...completeUserData, ...facultyResult.data };
        }
      }

      // Add formatted name
      completeUserData.name =
        completeUserData.first_name && completeUserData.last_name
          ? `${completeUserData.first_name} ${completeUserData.last_name}`
          : completeUserData.email;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: completeUserData,
      });

      return { success: true, user: completeUserData };
    } catch (error) {
      const errorMessage = error.message || "Invalid email or password";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout API (optional, for server-side token invalidation)
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userRole");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateProfile = async (updatedData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const { success, data, error } = await authService.updateProfile(
        state.user.id,
        updatedData
      );

      if (!success) {
        throw new Error(error || "Profile update failed");
      }

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: data,
      });

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: true, data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const refreshUserData = async () => {
    try {
      const { success, data } = await authService.getCurrentUser();

      if (success && data) {
        // Fetch role-specific profile
        let profileData = null;

        if (data.role === "student") {
          const studentResult = await authService.getStudentProfile(data.id);
          if (studentResult.success) {
            profileData = studentResult.data;
          }
        } else if (data.role === "faculty") {
          const facultyResult = await authService.getFacultyProfile(data.id);
          if (facultyResult.success) {
            profileData = facultyResult.data;
          }
        }

        const completeUserData = {
          ...data,
          ...profileData,
          name:
            data.first_name && data.last_name
              ? `${data.first_name} ${data.last_name}`
              : data.email,
        };

        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: completeUserData,
        });

        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return { success: false };
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    refreshUserData,
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
