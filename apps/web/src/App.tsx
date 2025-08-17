
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Home } from './pages/Home'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { LearningDashboard } from './pages/student/LearningDashboard'
import { TeacherDashboard } from './pages/teacher/TeacherDashboard'
import { LessonsManagement } from './pages/teacher/LessonsManagement'
import { ClassesManagement } from './pages/teacher/ClassesManagement'
import { StudentsManagement } from './pages/teacher/StudentsManagement'
import { Lessons } from './pages/Lessons'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/learning" 
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <LearningDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Teacher Routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/lessons" 
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <LessonsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/classes" 
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ClassesManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/students" 
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <StudentsManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/lessons" element={<Lessons />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}