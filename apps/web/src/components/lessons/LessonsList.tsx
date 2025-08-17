import React, { useState } from 'react'
import { useLessons } from '../../hooks/useLessons'
import { useDeleteLesson, usePublishLesson, useUnpublishLesson } from '../../hooks/useLessons'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table'
import { Eye, Edit, Trash2, Play, Pause, Target } from 'lucide-react'

interface LessonsListProps {
  onEditLesson?: (lessonId: string) => void
  onViewLesson?: (lessonId: string) => void
  onCreateActivity?: (lesson: any) => void
}

export const LessonsList: React.FC<LessonsListProps> = ({
  onEditLesson,
  onViewLesson,
  onCreateActivity,
}) => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  const { data: lessonsData, isLoading, error } = useLessons(page, limit)
  const deleteLessonMutation = useDeleteLesson()
  const publishLessonMutation = usePublishLesson()
  const unpublishLessonMutation = useUnpublishLesson()

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLessonMutation.mutateAsync(lessonId)
      } catch (error) {
        console.error('Failed to delete lesson:', error)
      }
    }
  }

  const handlePublishLesson = async (lessonId: string) => {
    try {
      await publishLessonMutation.mutateAsync(lessonId)
    } catch (error) {
      console.error('Failed to publish lesson:', error)
    }
  }

  const handleUnpublishLesson = async (lessonId: string) => {
    try {
      await unpublishLessonMutation.mutateAsync(lessonId)
    } catch (error) {
      console.error('Failed to unpublish lesson:', error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading lessons...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Failed to load lessons. Please try again.
      </div>
    )
  }

  if (!lessonsData?.data || lessonsData.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No lessons found. Create your first lesson to get started.
      </div>
    )
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lessons ({lessonsData.pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objectives</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonsData.data.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      {lesson.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {lesson.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(lesson.difficulty)}>
                      {lesson.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {lesson.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lesson.status)}>
                      {lesson.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {lesson.objectives.length} objectives
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {onCreateActivity && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCreateActivity(lesson)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Target className="w-4 h-4" />
                        </Button>
                      )}
                      {onViewLesson && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewLesson(lesson.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEditLesson && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditLesson(lesson.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {lesson.status === 'draft' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublishLesson(lesson.id)}
                          disabled={publishLessonMutation.isPending}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnpublishLesson(lesson.id)}
                          disabled={unpublishLessonMutation.isPending}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        disabled={deleteLessonMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {lessonsData.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Page {page} of {lessonsData.pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= lessonsData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 