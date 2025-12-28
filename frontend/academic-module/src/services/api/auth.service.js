import apiClient from "./client";

const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data; // Expected { user: {...}, token: "..." }
  },

  register: async (userData) => {
    const { data } = await apiClient.post("/auth/register", userData);
    return data;
  },

  logout: () => {
    // Optional: Call backend to blacklist token
    return apiClient.post("/auth/logout");
  },
};

export default authService;
