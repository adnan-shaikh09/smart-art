import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartart_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartart_token');
      localStorage.removeItem('smartart_admin');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API
export const publicApi = {
  getServices: () => api.get('/services?active=true'),
  getService: (id) => api.get(`/services/${id}`),
  getGallery: (params) => api.get('/gallery', { params }),
  getGalleryCategories: () => api.get('/gallery/categories/list'),
  getTestimonials: () => api.get('/testimonials'),
  getStats: () => api.get('/stats'),
  getSettings: () => api.get('/settings'),
  submitContact: (data) => api.post('/contact', data),
};

// Admin API
export const adminApi = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),

  // Services
  getServices: () => api.get('/services'),
  createService: (data) => api.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateService: (id, data) => api.put(`/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Gallery
  getGallery: () => api.get('/gallery/admin/all'),
  addGalleryItem: (data) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateGalleryItem: (id, data) => api.put(`/gallery/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteGalleryItem: (id) => api.delete(`/gallery/${id}`),

  // Testimonials
  getTestimonials: () => api.get('/testimonials/admin/all'),
  createTestimonial: (data) => api.post('/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Contacts
  getContacts: (params) => api.get('/contact', { params }),
  getContact: (id) => api.get(`/contact/${id}`),
  getContactStats: () => api.get('/contact/stats'),
  updateContactStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
  deleteContact: (id) => api.delete(`/contact/${id}`),
  testSmtp: () => api.post('/settings/test-smtp'),

  // Stats
  getStats: () => api.get('/stats'),
  updateStat: (data) => api.put('/stats', data),

  // Settings
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};

export default api;
