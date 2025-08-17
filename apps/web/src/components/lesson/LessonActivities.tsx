import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  CheckCircle,
  Target,
  Clock,
  Award,
  BookOpen
} from 'lucide-react'
import type { Activity } from '../../types/activities'

interface LessonActivitiesProps {
  lessonId: string
  activities: Activity[]
  onActivitySelect: (activity: Activity) => void
  onAddActivity?: () => void
  onEditActivity?: (activity: Activity) => void
  onDeleteActivity?: (activityId: string) => void
  isTeacher?: boolean
  completedActivities?: Set<string>
  activityScores?: Record<string, number>
}

export function LessonActivities({ 
  lessonId, 
  activities, 
  onActivitySelect,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  isTeacher = false,
  completedActivities = new Set(),
  activityScores = {}
}: LessonActivitiesProps) {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType
    const matchesDifficulty = filterDifficulty === 'all' || activity.difficulty === filterDifficulty
    return matchesType && matchesDifficulty
  })

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '📝'
      case 'matching': return '🔗'
      case 'fill-blank': return '✏️'
      case 'listening': return '🎧'
      case 'speaking': return '🗣️'
      case 'reading': return '📖'
      default: return '📚'
    }
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Quiz'
      case 'matching': return 'Matching'
      case 'fill-blank': return 'Fill in Blanks'
      case 'listening': return 'Listening'
      case 'speaking': return 'Speaking'
      case 'reading': return 'Reading'
      default: return 'Activity'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-blue-600 bg-blue-100'
      case 'advanced': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityStats = () => {
    const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0)
    const completedCount = completedActivities.size
    const totalTime = activities.reduce((sum, activity) => sum + activity.estimatedTime, 0)
    
    return { totalPoints, completedCount, totalTime }
  }

  const stats = getActivityStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Lesson Activities</span>
          </h2>
          <p className="text-gray-600 mt-1">
            {activities.length} activities • {stats.totalPoints} total points • {stats.totalTime} minutes
          </p>
        </div>
        
        {isTeacher && onAddActivity && (
          <Button onClick={onAddActivity}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Available to complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {activities.length > 0 ? Math.round((stats.completedCount / activities.length) * 100) : 0}% done
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Available to earn</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Type:</span>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="quiz">Quiz</option>
            <option value="matching">Matching</option>
            <option value="fill-blank">Fill in Blanks</option>
            <option value="listening">Listening</option>
            <option value="speaking">Speaking</option>
            <option value="reading">Reading</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Difficulty:</span>
          <select 
            value={filterDifficulty} 
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Activities Found</h3>
            <p className="text-gray-500">
              {filterType !== 'all' || filterDifficulty !== 'all' 
                ? 'Try adjusting your filters to see more activities.'
                : 'This lesson doesn\'t have any activities yet.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-3">
                      <div className="text-3xl">{getActivityTypeIcon(activity.type)}</div>
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                              {activity.difficulty}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{activity.estimatedTime}m</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{activity.points} points</span>
                          </span>
                          <span className="text-blue-600 font-medium">
                            {getActivityTypeLabel(activity.type)}
                          </span>
                        </div>
                        
                        {completedActivities.has(activity.id) && (
                          <div className="mt-3 p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-700 font-medium">
                              ✅ Completed • Score: {activityScores[activity.id] || 0}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    {isTeacher ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditActivity?.(activity)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteActivity?.(activity.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        {completedActivities.has(activity.id) ? (
                          <Button 
                            variant="outline" 
                            onClick={() => onActivitySelect(activity)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                        ) : (
                          <Button onClick={() => onActivitySelect(activity)}>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 