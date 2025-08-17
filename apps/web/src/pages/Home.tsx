import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { GraduationCap, User, BookOpen, Users, Calendar, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { useAuth } from '../contexts/AuthContext'

export function Home() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user.role)
    }
  }, [isAuthenticated, user])

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'student':
        navigate('/student/dashboard')
        break
      case 'teacher':
        navigate('/teacher/dashboard')
        break
      case 'admin':
        navigate('/teacher/dashboard') // Admin can access teacher dashboard
        break
      default:
        navigate('/student/dashboard') // Default to student dashboard
    }
  }

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role)
    setShowLogin(true)
  }

  const handleBackToRoleSelection = () => {
    setSelectedRole(null)
    setShowLogin(false)
  }

  const handleLoginSuccess = (userRole: string) => {
    // Login successful, redirect based on role
    redirectBasedOnRole(userRole)
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={handleBackToRoleSelection}
              className="mb-4"
            >
              ← Quay lại chọn vai trò
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">
              Đăng nhập với vai trò {selectedRole === 'student' ? 'Học sinh' : 'Giáo viên'}
            </h2>
          </div>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Chào mừng đến với EngRisk
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chọn vai trò của bạn để bắt đầu hành trình học tiếng Anh
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Student Card */}
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            onClick={() => handleRoleSelect('student')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Học sinh</CardTitle>
              <CardDescription className="text-blue-600">
                Tôi muốn học tiếng Anh
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Truy cập bài học và bài tập</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Theo dõi tiến độ học tập</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Xem kết quả học tập</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            onClick={() => handleRoleSelect('teacher')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Giáo viên</CardTitle>
              <CardDescription className="text-green-600">
                Tôi muốn dạy tiếng Anh
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Tạo và quản lý bài học</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Quản lý lớp học</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Theo dõi tiến độ học sinh</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Tại sao chọn EngRisk?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bài học tương tác</h3>
              <p className="text-gray-600">Nội dung hấp dẫn giúp việc học trở nên thú vị và hiệu quả</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-4 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Giáo viên chuyên nghiệp</h3>
              <p className="text-gray-600">Học từ những giáo viên tiếng Anh có trình độ và kinh nghiệm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Theo dõi tiến độ</h3>
              <p className="text-gray-600">Theo dõi sự tiến bộ với phân tích chi tiết</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 