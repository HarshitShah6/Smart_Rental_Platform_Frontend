// API client configuration with axios
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// API helper functions
export const propertyAPI = {
  search: (filters: any) => apiClient.get('/properties/search', { params: filters }),
  getById: (id: string) => apiClient.get(`/properties/${id}`),
  create: (formData: FormData) => apiClient.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: any) => apiClient.put(`/properties/${id}`, data),
  delete: (id: string) => apiClient.delete(`/properties/${id}`),
}

export const chatAPI = {
  getConversations: (userId: string) => apiClient.get(`/chat/conversations/${userId}`),
  sendMessage: (data: any) => apiClient.post('/chat/messages', data),
}

export const authAPI = {
  session: (firebaseToken: string) => apiClient.post('/auth/session', {}, {
    headers: { Authorization: `Bearer ${firebaseToken}` }
  }),
}
