import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_PORT || import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
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
