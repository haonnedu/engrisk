import { useAuth } from '../../contexts/AuthContext'
import { useStudentLearning } from '../../hooks/useStudentLearning'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Navigation } from '../../components/common/Navigation'
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Target,
  Award,
  Users,
  Play,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Fetch student's learning data using new hook
  const { 
    learningDashboard, 
    studentProgress, 
    loading, 
    error 
  } = useStudentLearning(user?.id)

  // Calculate statistics from new data structure
  const totalClasses = learningDashboard?.totalClasses || 0
  const totalLessons = learningDashboard?.classes.reduce((acc, classItem) => acc + classItem.lessonCount, 0) || 0
  const totalActivities = learningDashboard?.classes.reduce((acc, classItem) => 
    acc + (classItem.lessonCount * 3), 0) || 0 // Estimate 3 activities per lesson
  
  const completedActivities = studentProgress?.totalCompletedActivities || 0
  const averageScore = studentProgress?.averageScore || 0

  const recentClasses = learningDashboard?.classes.slice(0, 3) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your learning dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Student'}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Active classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-xs text-muted-foreground">
                Available lessons
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
              <p className="text-xs text-muted-foreground">
                {completedActivities} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageScore > 0 ? `${averageScore.toFixed(1)}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrolled Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Enrolled Classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentClasses.length > 0 ? (
                <div className="space-y-4">
                  {recentClasses.map((classItem) => (
                    <div key={classItem.classId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{classItem.className}</h4>
                        <p className="text-sm text-gray-600">{classItem.classDescription}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{classItem.classLevel}</Badge>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Lessons</div>
                        <div className="font-medium">{classItem.lessonCount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No classes enrolled</p>
              )}
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentProgress?.classProgress && studentProgress.classProgress.length > 0 ? (
                <div className="space-y-4">
                  {studentProgress.classProgress.slice(0, 3).map((classProgress) => (
                    <div key={classProgress.classId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{classProgress.className}</h4>
                        <p className="text-sm text-gray-600">
                          {classProgress.completedActivities} / {classProgress.totalActivities} activities
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{classProgress.completionRate.toFixed(1)}%</Badge>
                          <Badge variant="default">{classProgress.totalPoints} pts</Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="font-medium text-green-600">
                          {classProgress.averageScore.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No progress data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/student/learning')}
            >
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Continue Learning</h3>
                <p className="text-sm text-gray-600">Access your classes and lessons</p>
                <div className="flex items-center justify-center mt-2 text-blue-600">
                  <span className="text-sm">Go to Learning</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/student/learning')}
            >
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold text-lg mb-2">Practice Activities</h3>
                <p className="text-sm text-gray-600">Complete exercises and quizzes</p>
                <div className="flex items-center justify-center mt-2 text-green-600">
                  <span className="text-sm">Start Practice</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/student/learning')}
            >
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-lg mb-2">View Progress</h3>
                <p className="text-sm text-gray-600">Check your performance</p>
                <div className="flex items-center justify-center mt-2 text-purple-600">
                  <span className="text-sm">See Progress</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 