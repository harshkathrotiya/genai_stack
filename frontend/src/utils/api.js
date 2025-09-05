import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiCall = async (method, url, data) => {
  try {
    const response = await api[method](url, data);
    // Handle different response structures
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error(`API call failed: ${method.toUpperCase()} ${url}`, error);
    
    // Return consistent error structure
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    
    return {
      success: false,
      error: errorMessage,
      data: null
    };
  }
};

export default api;