import axios from 'axios';

const API_URL = 'https://noory-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  getProfile: () => api.get('/profile'),
};

// Product APIs
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products?category=${category}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateItem: (id, data) => api.put(`/cart/${id}`, data),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Order APIs
export const orderAPI = {
  getOrders: () => api.get('/orders'),
  createOrder: (data) => api.post('/orders', data),
  getOrder: (id) => api.get(`/orders/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: () => api.get('/admin/orders'),
  getDriverApplications: () => api.get('/admin/driver-applications'),
  approveDriver: (id) => api.post(`/admin/driver-applications/${id}/approve`),
  rejectDriver: (id) => api.post(`/admin/driver-applications/${id}/reject`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

// Driver APIs
export const driverAPI = {
  submitApplication: (data) => api.post('/driver/applications', data),
  getAvailableOrders: () => api.get('/driver/available-orders'),
  acceptOrder: (id, data) => api.post(`/driver/orders/${id}/accept`, data),
  getDriverOrders: (driverId) => api.get(`/driver/orders?driver_id=${driverId}`),
};