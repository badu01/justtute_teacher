// services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://justute.onrender.com/api'; // Change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2NiYzg4ODViNDk2NWJhOTRhNDkwZSIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzcwNDM5MzIzLCJleHAiOjE3NzgyMTUzMjN9.I5qZDbYtGT5juZ0PKXiM1n5_56LzfHpyxrzBNZfur5Q";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export default api;