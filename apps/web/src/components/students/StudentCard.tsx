import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Eye, Edit, Trash2, Phone, Calendar } from 'lucide-react'

interface Student {
  id: string
  name: string
  phone: string
  role: 'student'
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface StudentCardProps {
  student: Student
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
  isDeleting?: boolean
}

export function StudentCard({ 
  student, 
  onView, 
  onEdit, 
  onDelete, 
  isDeleting = false 
}: StudentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {student.avatar ? (
                <img 
                  src={student.avatar} 
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-medium text-lg">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500">ID: {student.id.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={student.isActive ? 'default' : 'secondary'}>
              {student.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Contact Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{student.phone}</span>
          </div>
          
          {/* Join Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Joined: {formatDate(student.createdAt)}</span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(student)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(student)}
              className="text-green-600 hover:text-green-800 hover:bg-green-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(student.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 