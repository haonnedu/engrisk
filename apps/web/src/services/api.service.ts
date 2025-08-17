import { apiClient } from '../lib/axios'

// Base API service
export class ApiService {
  protected client = apiClient

  // Static methods for direct usage
  static async get<T>(url: string): Promise<T> {
    const response = await apiClient.get<T>(url)
    return response.data
  }

  static async post<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.post<T>(url, data)
    return response.data
  }

  static async put<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.put<T>(url, data)
    return response.data
  }

  static async delete<T>(url: string): Promise<T> {
    const response = await apiClient.delete<T>(url)
    return response.data
  }

  // Auth token management
  static setAuthToken(token: string) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  static removeAuthToken() {
    delete apiClient.defaults.headers.common['Authorization']
  }

  // Instance methods for inheritance
  protected async getInstance<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url)
    return response.data
  }

  protected async postInstance<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  protected async putInstance<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  protected async deleteInstance<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
} 