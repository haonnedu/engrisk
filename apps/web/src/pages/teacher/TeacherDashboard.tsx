import { useAuth } from '../../contexts/AuthContext'
import { useClasses } from '../../hooks/useClasses'
import { useLessons } from '../../hooks/useLessons'
import { useStudents } from '../../hooks/useStudents'
import { useTeacherStatistics } from '../../hooks/useTeachers'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Navigation } from '../../components/common/Navigation'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Award
} from 'lucide-react'

export function TeacherDashboard() {
  const { user } = useAuth()
  
  // Fetch teacher's data
  const { data: classesData } = useClasses(1, 100)
  const { data: lessonsData } = useLessons(1, 100)
  const { data: studentsData } = useStudents(1, 100)
  const { data: teacherStats } = useTeacherStatistics(user?.id || '')

  // Calculate statistics
  const totalClasses = classesData?.data?.length || 0
  const totalLessons = lessonsData?.data?.length || 0
  const totalStudents = studentsData?.data?.length || 0
  
  const publishedLessons = lessonsData?.data?.filter(lesson => lesson.status === 'published').length || 0
  const draftLessons = lessonsData?.data?.filter(lesson => lesson.status === 'draft').length || 0
  
  const activeClasses = classesData?.data?.filter(classItem => classItem.status === 'active').length || 0
  const inactiveClasses = classesData?.data?.filter(classItem => classItem.status === 'inactive').length || 0

  const recentClasses = classesData?.data?.slice(0, 5) || []
  const recentLessons = lessonsData?.data?.slice(0, 5) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Teacher'}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                {activeClasses} active, {inactiveClasses} inactive
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
                {publishedLessons} published, {draftLessons} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled across all classes
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
                {teacherStats?.averageStudentScore ? `${teacherStats.averageStudentScore}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Student performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentClasses.length > 0 ? (
                <div className="space-y-4">
                  {recentClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                        <p className="text-sm text-gray-600">{classItem.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{classItem.level}</Badge>
                          <Badge variant={classItem.status === 'active' ? 'default' : 'secondary'}>
                            {classItem.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Max Students</div>
                        <div className="font-medium">{classItem.maxStudents}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No classes found</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Recent Lessons</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentLessons.length > 0 ? (
                <div className="space-y-4">
                  {recentLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{lesson.difficulty}</Badge>
                          <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                            {lesson.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                        <div className="mt-1">
                          {lesson.objectives?.length || 0} objectives
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No lessons found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Create Class</h3>
                <p className="text-sm text-gray-600">Add new class</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold text-lg mb-2">Create Lesson</h3>
                <p className="text-sm text-gray-600">Add new lesson</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-lg mb-2">Create Activity</h3>
                <p className="text-sm text-gray-600">Add new activity</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 