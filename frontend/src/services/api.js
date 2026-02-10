import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
}

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getTechStacks: () => api.get('/products/techstacks')
}

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getOrder: (id) => api.get(`/orders/${id}`),
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
  deliverOrder: (id, data) => api.put(`/orders/${id}/deliver`, data),
  getStats: () => api.get('/orders/admin/stats'),
  uploadPayment: (id, formData) => api.post(`/orders/${id}/payment`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createCheckoutSession: (data) => api.post('/orders/create-checkout-session', data),
  confirmPayment: (data) => api.post('/orders/confirm-payment', data)
}

// Settings APIs
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getUpiQr: () => api.get('/settings/upi-qr'),
  update: (data) => api.post('/settings', data),
  uploadUpiQr: (formData) => api.post('/settings', {
    key: 'upi_qr_code',
    value: formData.get('file'),
    type: 'image'
  })
}

export default api
