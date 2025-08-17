import { Button } from '../ui/button'
import { Play, BookOpen, BarChart3, Home, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface StudentNavigationProps {
  currentPage: 'dashboard' | 'learning' | 'progress'
  showUserInfo?: boolean
}

export function StudentNavigation({ currentPage, showUserInfo = true }: StudentNavigationProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getButtonVariant = (page: string) => {
    return currentPage === page ? 'default' : 'ghost'
  }

  const getButtonColor = (page: string) => {
    if (currentPage === page) return ''
    
    switch (page) {
      case 'dashboard': return 'text-gray-600 hover:text-gray-700'
      case 'learning': return 'text-blue-600 hover:text-blue-700'
      case 'progress': return 'text-purple-600 hover:text-purple-700'
      default: return 'text-gray-600 hover:text-gray-700'
    }
  }

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EngRisk</span>
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-1">
              <Button 
                variant={getButtonVariant('dashboard')}
                className={`flex items-center space-x-2 ${getButtonColor('dashboard')}`}
                onClick={() => navigate('/student/dashboard')}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              
              <Button 
                variant={getButtonVariant('learning')}
                className={`flex items-center space-x-2 ${getButtonColor('learning')}`}
                onClick={() => navigate('/student/learning')}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learning</span>
              </Button>
              
              <Button 
                variant={getButtonVariant('progress')}
                className={`flex items-center space-x-2 ${getButtonColor('progress')}`}
                onClick={() => navigate('/student/dashboard')}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Progress</span>
              </Button>
            </nav>
          </div>
          
          {/* User Info & Actions */}
          {showUserInfo && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Welcome, {user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 