import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { 
  LogOut, 
  User, 
  BookOpen, 
  Users, 
  BarChart3, 
  GraduationCap,
  Home
} from 'lucide-react'

export function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNavigationItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/student/dashboard', icon: Home },
          { label: 'Learning', path: '/student/learning', icon: GraduationCap },
        ]
      case 'teacher':
      case 'admin':
        return [
          { label: 'Dashboard', path: '/teacher/dashboard', icon: Home },
          { label: 'Manage Lessons', path: '/teacher/lessons', icon: BookOpen },
          { label: 'Manage Classes', path: '/teacher/classes', icon: Users },
          { label: 'Manage Students', path: '/teacher/students', icon: GraduationCap },
        ]
      default:
        return []
    }
  }

  if (!user) return null

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EngRisk</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 