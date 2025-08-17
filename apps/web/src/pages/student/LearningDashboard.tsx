import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Clock, 
  Play, 
  CheckCircle, 
  ArrowLeft, 
  Home, 
  Users,
  ArrowRight,
  GraduationCap
} from 'lucide-react'
import { ActivityContainer } from '../../components/activities/ActivityContainer'
import { StudentNavigation } from '../../components/student/StudentNavigation'
import { useNavigate } from 'react-router-dom'
import { useStudentLearning } from '../../hooks/useStudentLearning'
import { useAuth } from '../../contexts/AuthContext'

export const LearningDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  const {
    learningDashboard,
    selectedClassLessons,
    selectedLessonActivities,
    selectedActivity: activityDetail,
    studentProgress,
    loading,
    error,
    selectClass,
    selectLesson,
    selectActivity,
    goBackToLessons,
    goBackToClasses,
    refresh
  } = useStudentLearning(user?.id)

  const handleClassSelect = async (classId: string) => {
    setSelectedClassId(classId)
    await selectClass(classId)
  }

  const handleLessonSelect = async (lessonId: string) => {
    await selectLesson(lessonId)
  }

  const handleActivitySelect = async (activityId: string) => {
    await selectActivity(activityId)
  }

  const handleBackToLessons = () => {
    goBackToLessons()
  }

  const handleBackToClasses = () => {
    goBackToClasses()
    setSelectedClassId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavigation currentPage="learning" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your learning content...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavigation currentPage="learning" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refresh}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedActivity && activityDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavigation currentPage="learning" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBackToLessons}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Activities
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{activityDetail.title}</h1>
            <p className="text-gray-600 mb-4">{activityDetail.description}</p>
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary">{activityDetail.type}</Badge>
              <Badge variant="outline">{activityDetail.difficulty}</Badge>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{activityDetail.estimatedTime} min</span>
              </div>
              <div className="text-sm text-gray-600">
                {activityDetail.points} points
              </div>
            </div>
          </div>
          <ActivityContainer
            activity={{ id: selectedActivity } as any}
            onComplete={() => {
              setSelectedActivity(null)
              refresh()
            }}
          />
        </div>
      </div>
    )
  }

  if (selectedClassId && selectedClassLessons.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavigation currentPage="learning" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBackToClasses}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classes
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Lessons</h1>
            <p className="text-gray-600 mb-4">Select a lesson to view activities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedClassLessons.map((lesson) => (
              <Card 
                key={lesson.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleLessonSelect(lesson.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <Badge variant="secondary">Lesson {lesson.order}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Target className="w-4 h-4" />
                      <span>{lesson.activityCount} activities</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (selectedLessonActivities.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavigation currentPage="learning" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBackToClasses}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Activities</h1>
            <p className="text-gray-600 mb-4">Select an activity to start learning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedLessonActivities.map((activity) => (
              <Card 
                key={activity.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleActivitySelect(activity.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                    <Badge variant="secondary">{activity.type}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.estimatedTime} min</span>
                      </div>
                      <div>{activity.points} pts</div>
                    </div>
                    <Play className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavigation currentPage="learning" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Dashboard</h1>
          <p className="text-gray-600">Access your enrolled classes and learning materials</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/student/dashboard')}>
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">View Progress</h3>
              <p className="text-gray-600">Check your scores and learning progress</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/student/dashboard')}>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">View Results</h3>
              <p className="text-gray-600">See results of completed activities</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Classes */}
        {!learningDashboard || learningDashboard.classes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Classes Enrolled</h3>
              <p className="text-gray-600 mb-4">Enroll in a class to start learning</p>
              <Button onClick={() => navigate('/student/dashboard')}>
                <ArrowRight className="w-4 h-4 mr-2" />
                View Available Classes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Enrolled Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningDashboard.classes.map((classItem) => {
                const classProgress = studentProgress?.classProgress.find(p => p.classId === classItem.classId)
                
                return (
                  <Card 
                    key={classItem.classId} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleClassSelect(classItem.classId)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                          <CardTitle className="text-lg">{classItem.className}</CardTitle>
                        </div>
                        <Badge variant="secondary">{classItem.classLevel}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{classItem.classDescription}</p>
                      
                      {/* Progress Bar */}
                      {classProgress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{classProgress.completionRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={classProgress.completionRate} className="h-2" />
                        </div>
                      )}
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-blue-600">{classItem.lessonCount}</div>
                          <div className="text-gray-600">Lessons</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-green-600">{classItem.totalPoints}</div>
                          <div className="text-gray-600">Points</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Enrolled: {new Date(classItem.enrolledAt).toLocaleDateString()}
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 