import axios from 'axios'
import { appConfig } from '../config/app.config'

// Tạo axios instance với cấu hình mặc định
export const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      // Token hết hạn, clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
      // Không redirect để tránh reload trang
    }
    return Promise.reject(error)
  }
) 