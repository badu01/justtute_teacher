// services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://justute.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from storage
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to set token
const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

// Helper function to clear token
const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  // Teacher login
  login: async (email, password) => {
    try {
      const response = await api.post('/teacher/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get current teacher profile
  getProfile: async () => {
    try {
      const response = await api.get('/teacher/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Logout (clear token on client side)
  logout: () => {
    clearToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  }
};

// Sessions API
export const sessionsAPI = {
  // Get all sessions for teacher
  getSessions: async (page = 1, limit = 50) => {
    try {
      const response = await api.get(`/teacher/sessions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  // Create a new session
  createSession: async (sessionData) => {
    try {
      const response = await api.post('/teacher/session', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  // Update a session
  updateSession: async (sessionId, updateData) => {
    try {
      const response = await api.put(`/teacher/session/${sessionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },

  // Delete a session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/teacher/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },
};

export { getToken, setToken, clearToken };
export default api;