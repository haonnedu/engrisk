import React, { useState } from 'react'
import { useActivities } from '../../hooks/useActivities'
import { useDeleteActivity } from '../../hooks/useActivities'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table'
import { Eye, Edit, Trash2, Search, Filter, Play, Clock, Target } from 'lucide-react'

interface ActivitiesListProps {
  lessonId?: string
  onEditActivity?: (activityId: string) => void
  onViewActivity?: (activityId: string) => void
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  lessonId,
  onEditActivity,
  onViewActivity,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  
  const { data: activities, isLoading, error } = useActivities()
  const deleteActivityMutation = useDeleteActivity()

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivityMutation.mutateAsync(activityId)
      } catch (error) {
        console.error('Failed to delete activity:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading activities...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Failed to load activities. Please try again.
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activities found. Create your first activity to get started.
      </div>
    )
  }

  // Filter activities
  let filteredActivities = activities
  
  if (lessonId) {
    filteredActivities = filteredActivities.filter(activity => activity.lessonId === lessonId)
  }
  
  if (searchTerm) {
    filteredActivities = filteredActivities.filter(activity =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
  
  if (filterType !== 'all') {
    filteredActivities = filteredActivities.filter(activity => activity.type === filterType)
  }
  
  if (filterDifficulty !== 'all') {
    filteredActivities = filteredActivities.filter(activity => activity.difficulty === filterDifficulty)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-800'
      case 'matching':
        return 'bg-green-100 text-green-800'
      case 'fill-blank':
        return 'bg-purple-100 text-purple-800'
      case 'reading':
        return 'bg-orange-100 text-orange-800'
      case 'speaking':
        return 'bg-pink-100 text-pink-800'
      case 'listening':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return '📝'
      case 'matching':
        return '🔗'
      case 'fill-blank':
        return '✏️'
      case 'reading':
        return '📖'
      case 'speaking':
        return '🗣️'
      case 'listening':
        return '🎧'
      default:
        return '📋'
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="matching">Matching</SelectItem>
                <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="speaking">Speaking</SelectItem>
                <SelectItem value="listening">Listening</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activities found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Time & Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getTypeIcon(activity.type)}</div>
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          {activity.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {activity.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(activity.difficulty)}>
                        {activity.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{activity.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Target className="w-3 h-3" />
                          <span>{activity.points} pts</span>
                        </div>
                        {activity.timeLimit > 0 && (
                          <div className="text-xs text-gray-500">
                            Limit: {activity.timeLimit} min
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {activity.isCompleted ? (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Pending
                          </Badge>
                        )}
                        {activity.score !== undefined && (
                          <div className="text-sm text-gray-600">
                            Score: {activity.score}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {onViewActivity && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewActivity(activity.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {onEditActivity && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditActivity(activity.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Start activity:', activity.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteActivity(activity.id)}
                          disabled={deleteActivityMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 