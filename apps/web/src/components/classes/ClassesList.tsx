import React, { useState } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { useDeleteClass } from '../../hooks/useClasses'
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

interface ClassesListProps {
  onEditClass?: (classId: string) => void
  onViewClass?: (classId: string) => void
  onManageStudents?: (classId: string) => void
}

export const ClassesList: React.FC<ClassesListProps> = ({
  onEditClass,
  onViewClass,
  onManageStudents,
}) => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  const { data: classesData, isLoading, error } = useClasses(page, limit)
  const deleteClassMutation = useDeleteClass()

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClassMutation.mutateAsync(classId)
      } catch (error) {
        console.error('Failed to delete class:', error)
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading classes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Failed to load classes. Please try again.
      </div>
    )
  }

  if (!classesData?.data || classesData.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No classes found. Create your first class to get started.
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
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
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
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
          <CardTitle>Classes ({classesData.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesData.data.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{classItem.name}</div>
                      {classItem.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {classItem.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(classItem.level)}>
                      {classItem.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {classItem.maxStudents} max
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(classItem.status)}>
                      {classItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {classItem.schedule || 'Not set'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {onViewClass && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClass(classItem.id)}
                        >
                          View
                        </Button>
                      )}
                      {onEditClass && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditClass(classItem.id)}
                        >
                          Edit
                        </Button>
                      )}
                      {onManageStudents && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onManageStudents(classItem.id)}
                        >
                          Manage Students
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClass(classItem.id)}
                        disabled={deleteClassMutation.isPending}
                      >
                        {deleteClassMutation.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {classesData.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Page {page} of {classesData.totalPages}
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
                  disabled={page >= classesData.totalPages}
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