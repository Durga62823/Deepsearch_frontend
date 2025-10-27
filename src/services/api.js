import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_PORT || import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Store the logout callback - will be set by AuthContext
let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      // Check if the error message indicates token expiration
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || '';
      const isTokenExpired = errorMessage.toLowerCase().includes('token') || 
                            errorMessage.toLowerCase().includes('expired') ||
                            errorMessage.toLowerCase().includes('invalid') ||
                            errorMessage.toLowerCase().includes('authorization denied');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call logout callback if available
      if (logoutCallback) {
        logoutCallback();
      }
      
      // Only redirect if not already on login/signup page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        // Show user-friendly message
        const message = isTokenExpired 
          ? 'Your session has expired. Please log in again.' 
          : 'Authentication required. Please log in.';
        
        // Use a toast/notification if available, otherwise alert
        if (window.showToast) {
          window.showToast(message, 'error');
        } else {
          alert(message);
        }
        
        // Redirect to login with return URL
        setTimeout(() => {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),

  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
};

export const documentAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAll: (filter) => {
    let url = '/documents';
    if (filter === 'favorites') {
      url += `?filter=favorites`;
    }
    return api.get(url);
  },

  ask: (payload) => api.post('/documents/ask', payload),

  getById: (id) => api.get(`/documents/${id}`),

  updateFavoriteStatus: (id, isFavorite) => api.put(`/documents/${id}`, { isFavorite }),

  delete: (id) => api.delete(`/documents/${id}`),
};
