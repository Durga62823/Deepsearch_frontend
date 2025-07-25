// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL // removed /api


const api = axios.create({
  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  // If a token exists, add it to the request headers under 'x-auth-token'
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config; // Return the modified config
}, error => {
  // Handle request errors (e.g., network issues before sending the request)
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response, // If the response is successful (2xx), just return it
  async error => {
    // If the error response has a status of 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('API Error: 401 Unauthorized. Session might be expired or invalid token.');
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear user data if stored separately

      if (window.location.pathname !== '/login') { // Prevent infinite redirects if already on login page

        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    }
    // Re-throw the error so it can be caught by the component making the API call
    return Promise.reject(error); 
  }
);

// Export an object containing authentication-related API calls
export const authAPI = {
  // Login function: sends email and password to the login endpoint
  login: (email, password) => api.post('login', { email, password }),
  // Signup function: sends name, email, and password to the signup endpoint
  signup: (name, email, password) => api.post('/signup', { name, email, password }),
};

// Export an object containing document-related API calls
export const documentAPI = {
  // Upload function:
  // Creates FormData to send the file.
  // The 'pdf' key must match the field name Multer expects on the backend.
  upload: (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    // Explicitly set 'Content-Type' to 'multipart/form-data'. While Axios often handles this
    // for FormData, explicitly setting it ensures correct header construction in all environments.
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  },
  // Get all documents for the authenticated user
  getAll: () => api.get('/documents'),
  // Get a specific document by its ID
  getById: (id) => api.get(`/documents/${id}`),
  // Add the delete method here for deleting documents by ID
  delete: (id) => api.delete(`/documents/${id}`), // Axios DELETE request to your backend endpoint
};
