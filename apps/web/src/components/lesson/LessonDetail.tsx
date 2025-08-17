import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { 
  BookOpen, 
  Target, 
  Clock, 
  Play, 
  CheckCircle, 
  ArrowLeft,
  List,
  FileText,
  Award,
  Users
} from 'lucide-react'
import { ActivityContainer } from '../activities/ActivityContainer'
import { ActivityResults } from '../activities/ActivityResults'
import type { Lesson } from '../../types/lesson'
import type { Activity } from '../../types/activities'

interface LessonDetailProps {
  lesson: Lesson
  activities: Activity[]
  onBack: () => void
}

export function LessonDetail({ lesson, activities, onBack }: LessonDetailProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set())
  const [activityScores, setActivityScores] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [lastCompletedActivity, setLastCompletedActivity] = useState<{
    activity: Activity
    score: number
    timeSpent: number
  } | null>(null)

  const handleActivityComplete = (activityId: string, score: number, timeSpent: number) => {
    setCompletedActivities(prev => new Set([...prev, activityId]))
    setActivityScores(prev => ({ ...prev, [activityId]: score }))
    
    const activity = activities.find(a => a.id === activityId)
    if (activity) {
      setLastCompletedActivity({ activity, score, timeSpent })
      setShowResults(true)
    }
  }

  const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0)
  const earnedPoints = activities.reduce((sum, activity) => {
    return sum + (completedActivities.has(activity.id) ? (activityScores[activity.id] || 0) : 0)
  }, 0)
  const progress = activities.length > 0 ? (completedActivities.size / activities.length) * 100 : 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-blue-600 bg-blue-100'
      case 'advanced': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'archived': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (showResults && lastCompletedActivity) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="outline"
          onClick={() => setShowResults(false)}
          className="mb-4"
        >
          ← Back to Lesson
        </Button>
        <ActivityResults
          activity={lastCompletedActivity.activity}
          score={lastCompletedActivity.score}
          timeSpent={lastCompletedActivity.timeSpent}
          onRetry={() => {
            setShowResults(false)
            setSelectedActivity(lastCompletedActivity.activity)
          }}
          onNext={() => {
            setShowResults(false)
            // Find next incomplete activity
            const nextActivity = activities.find(a => !completedActivities.has(a.id))
            if (nextActivity) {
              setSelectedActivity(nextActivity)
            }
          }}
          onBack={() => {
            setShowResults(false)
            setSelectedActivity(null)
          }}
        />
      </div>
    )
  }

  if (selectedActivity) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="outline"
          onClick={() => setSelectedActivity(null)}
          className="mb-4"
        >
          ← Back to Lesson
        </Button>
        <ActivityContainer
          activity={selectedActivity}
          onComplete={(score, timeSpent) => handleActivityComplete(selectedActivity.id, score, timeSpent)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Lessons
      </Button>

      {/* Lesson Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{lesson.description}</p>
            
            {/* Lesson Meta */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">{lesson.duration} minutes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lesson.status)}`}>
                  {lesson.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Lesson Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
                <div className="text-sm text-gray-600">Total Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedActivities.size}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{earnedPoints}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Lesson Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Learning Objectives</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Lesson Materials */}
      {lesson.materials && lesson.materials.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>Learning Materials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {lesson.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{material}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Play className="w-6 h-6 text-blue-600" />
          <span>Lesson Activities</span>
        </h2>
        
        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Activities Yet</h3>
              <p className="text-gray-500">This lesson doesn't have any activities yet. Check back later!</p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">{activity.title}</h3>
                      {completedActivities.has(activity.id) && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span className="capitalize">{activity.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.estimatedTime}m</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{activity.points} points</span>
                      </span>
                      {completedActivities.has(activity.id) && (
                        <span className="text-green-600 font-medium">
                          Score: {activityScores[activity.id]}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-6">
                    {completedActivities.has(activity.id) ? (
                      <Button variant="outline" onClick={() => setSelectedActivity(activity)}>
                        <Play className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    ) : (
                      <Button onClick={() => setSelectedActivity(activity)}>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 