import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE = 'http://localhost:3000/api/uploads/';

// Backend examples:
// - http://localhost:3000/uploads/services/thumbnail-...png
// - http://localhost:3000/uploads/<filename>


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('orvix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // FormData butuh boundary multipart; jangan pakai application/json default
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('orvix_token');
      localStorage.removeItem('orvix_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { UPLOADS_BASE };
export default api;
