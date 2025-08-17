import React from 'react'
import { StudentCard } from './StudentCard'

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

interface StudentGridProps {
  students: Student[]
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
  isDeleting?: boolean
}

export function StudentGrid({ 
  students, 
  onView, 
  onEdit, 
  onDelete, 
  isDeleting = false 
}: StudentGridProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
        <p className="text-gray-500">Start by adding new students to the system.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
} 