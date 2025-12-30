import api from "./api";

const authService = {
  // Login (correct — no change needed)
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login/", credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      };
    }
  },

  // Get current user profile (correct — no change needed)
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user data",
      };
    }
  },

  // Logout (correct — no change needed)
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await api.post("/auth/logout/", { refresh: refreshToken });
      }
      return { success: true };
    } catch (error) {
      return { success: true }; // Always succeed locally
    }
  },

  // Refresh token (correct — no change needed)
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post("/auth/token/refresh/", {
        refresh: refreshToken,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: "Token refresh failed",
      };
    }
  },

  // Update profile — FIXED: removed /academic/
  updateProfile: async (userId, data) => {
    try {
      const response = await api.patch(`/users/${userId}/`, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Profile update failed",
      };
    }
  },

  // Get student profile — FIXED: removed /academic/
  getStudentProfile: async (userId) => {
    try {
      const response = await api.get(`/students/?user=${userId}`);
      // Handle both paginated (results) and non-paginated responses
      const results = response.data.results || response.data || [];
      return {
        success: true,
        data: Array.isArray(results) && results.length > 0 ? results[0] : null,
      };
    } catch (error) {
      console.error("Student profile fetch error:", error);
      return {
        success: false,
        error: "Failed to fetch student profile",
      };
    }
  },

  // Get faculty profile — FIXED: removed /academic/
  getFacultyProfile: async (userId) => {
    try {
      const response = await api.get(`/faculty-members/?user=${userId}`);
      const results = response.data.results || response.data || [];
      return {
        success: true,
        data: Array.isArray(results) && results.length > 0 ? results[0] : null,
      };
    } catch (error) {
      console.error("Faculty profile fetch error:", error);
      return {
        success: false,
        error: "Failed to fetch faculty profile",
      };
    }
  },

  // Get admin profile — FIXED: removed /academic/
  getAdminProfile: async (userId) => {
    try {
      const response = await api.get(`/admins/?user=${userId}`);
      const results = response.data.results || response.data || [];
      return {
        success: true,
        data: Array.isArray(results) && results.length > 0 ? results[0] : null,
      };
    } catch (error) {
      console.error("Admin profile fetch error:", error);
      return {
        success: false,
        error: "Failed to fetch admin profile",
      };
    }
  },
};

export default authService;
