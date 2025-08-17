import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, LoginRequest, LoginResponse } from '../types/openapi'
import { ApiService } from '../services/api.service'

interface AuthContextType {
  user: User | null
  login: (phone: string, password: string) => Promise<User | undefined>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Kiểm tra user đã đăng nhập từ localStorage
    const savedUser = localStorage.getItem('userInfo')
    const savedToken = localStorage.getItem('accessToken')
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      // Set token for API calls
      ApiService.setAuthToken(savedToken)
    }
  }, [])

  const login = async (phone: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await ApiService.post<LoginResponse>('/auth/login', { phone, password })
      
      if (response.access_token) {
        const userData = response.user
        
        // Add missing properties to match User interface
        const fullUserData: User = {
          ...userData,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setUser(fullUserData)
        localStorage.setItem('userInfo', JSON.stringify(fullUserData))
        localStorage.setItem('accessToken', response.access_token)
        
        // Set token for future API calls
        ApiService.setAuthToken(response.access_token)
        
        // Return user data for immediate use
        return fullUserData
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userInfo')
    localStorage.removeItem('accessToken')
    ApiService.removeAuthToken()
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 