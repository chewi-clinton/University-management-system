const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function for API requests
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const token = getToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }
    
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (name, email, password, role) =>
    apiCall('/auth/register', 'POST', { name, email, password, role }),
  login: (email, password) =>
    apiCall('/auth/login', 'POST', { email, password })
};

// Tuition API
export const tuitionAPI = {
  getAll: (status) => apiCall(`/tuition?status=${status || ''}`),
  getStats: () => apiCall('/tuition/stats'),
  create: (data) => apiCall('/tuition', 'POST', data),
  updateStatus: (id, status, paidDate) =>
    apiCall(`/tuition/${id}`, 'PUT', { status, paidDate })
};

// Payroll API
export const payrollAPI = {
  getAll: (status, period) => apiCall(`/payroll?status=${status || ''}&period=${period || ''}`),
  getStats: () => apiCall('/payroll/stats'),
  create: (data) => apiCall('/payroll', 'POST', data),
  updateStatus: (id, status, paidDate) =>
    apiCall(`/payroll/${id}`, 'PUT', { status, paidDate })
};

// Students API
export const studentsAPI = {
  getAll: () => apiCall('/students'),
  create: (data) => apiCall('/students', 'POST', data)
};