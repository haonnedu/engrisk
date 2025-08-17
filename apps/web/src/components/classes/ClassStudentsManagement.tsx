import React, { useState, useEffect } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { useStudents } from '../../hooks/useStudents'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ClassStudentsManagementProps {
  classId: string
  className: string
}

export function ClassStudentsManagement({ classId, className }: ClassStudentsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [isRemovingStudent, setIsRemovingStudent] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const { data: classStudents, refetch: refetchClassStudents } = useClasses()
  const { data: allStudents } = useStudents(1, 1000)

  // Get current class students
  const currentClass = classStudents?.data?.find(c => c.id === classId)
  const enrolledStudents = (currentClass as any)?.students || []

  // Filter available students (not enrolled in this class)
  const availableStudents = allStudents?.data?.filter(student => 
    !enrolledStudents.find((enrolled: any) => enrolled.id === student.id) &&
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleAddStudent = async () => {
    if (!selectedStudentId) return

    setIsAddingStudent(true)
    setMessage(null)

    try {
      // Call API to add student to class
      const response = await fetch(`http://localhost:3000/api/classes/${classId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: selectedStudentId }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Student added to class successfully!' })
        setSelectedStudentId('')
        refetchClassStudents()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to add student' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add student to class' })
    } finally {
      setIsAddingStudent(false)
    }
  }

  const handleRemoveStudent = async (studentId: string) => {
    setIsRemovingStudent(true)
    setMessage(null)

    try {
      const response = await fetch(`http://localhost:3000/api/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Student removed from class successfully!' })
        refetchClassStudents()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to remove student' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove student from class' })
    } finally {
      setIsRemovingStudent(false)
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Students</h2>
          <p className="text-gray-600">Class: {className}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {enrolledStudents.length} / {currentClass?.maxStudents || 20} Students
          </Badge>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Add Student Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add Student to Class</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Available Students</label>
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Student Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Student</label>
                <Select
                  value={selectedStudentId}
                  onValueChange={setSelectedStudentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleAddStudent}
                  disabled={!selectedStudentId || isAddingStudent}
                  className="w-full"
                >
                  {isAddingStudent ? 'Adding...' : 'Add to Class'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Current Students ({enrolledStudents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrolledStudents.length > 0 ? (
            <div className="space-y-3">
              {enrolledStudents.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.phone}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveStudent(student.id)}
                    disabled={isRemovingStudent}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No students enrolled in this class</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 