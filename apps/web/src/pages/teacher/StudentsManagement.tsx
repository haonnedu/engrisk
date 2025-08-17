import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useStudents, useDeleteStudent } from '../../hooks/useStudents'
import { CreateStudentForm } from '../../components/students/CreateStudentForm'
import { EditStudentForm } from '../../components/students/EditStudentForm'
import { StudentDetail } from '../../components/students/StudentDetail'
import { StudentGrid } from '../../components/students/StudentGrid'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Navigation } from '../../components/common/Navigation'
import { 
  Search, 
  Plus, 
  Users, 
  GraduationCap, 
  UserPlus,
  Trash2,
  Edit,
  Eye,
  Grid3X3,
  List
} from 'lucide-react'

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

export function StudentsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const { user } = useAuth()
  const { data: studentsData, isLoading, error } = useStudents(page, limit)
  const deleteStudentMutation = useDeleteStudent()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search for:', searchTerm)
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    // Don't redirect, just close the form
  }

  const handleEditSuccess = () => {
    setEditingStudent(null)
    // Don't redirect, just close the edit form
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudentMutation.mutateAsync(studentId)
        // Success message will be handled by the mutation
        // Close detail view if it's open
        if (viewingStudent && viewingStudent.id === studentId) {
          setViewingStudent(null)
        }
      } catch (error) {
        console.error('Failed to delete student:', error)
      }
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setViewingStudent(null) // Close detail view
  }

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student)
  }

  const filteredStudents = studentsData?.data?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  ) || []

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <CreateStudentForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    )
  }

  if (editingStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <EditStudentForm
          student={editingStudent}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingStudent(null)}
        />
      </div>
    )
  }

  if (viewingStudent) {
    return (
      <StudentDetail
        student={viewingStudent}
        onEdit={() => handleEditStudent(viewingStudent)}
        onDelete={() => handleDeleteStudent(viewingStudent.id)}
        onBack={() => setViewingStudent(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-gray-600">Manage your student list</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Student</span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsData?.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsData?.data?.filter(s => s.isActive).length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">New Students This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsData?.data?.filter(s => {
                    const createdAt = new Date(s.createdAt)
                    const now = new Date()
                    return createdAt.getMonth() === now.getMonth() && 
                           createdAt.getFullYear() === now.getFullYear()
                  }).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-4 flex-1">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </form>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-sm text-gray-600">View Mode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  type="button"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Student List</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              An error occurred while loading the student list
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm ? 'No students found matching your search' : 'No students yet'}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              <StudentGrid
                students={filteredStudents}
                onView={handleViewStudent}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                isDeleting={deleteStudentMutation.isPending}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {student.avatar ? (
                              <img 
                                src={student.avatar} 
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">ID: {student.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="capitalize">
                          {student.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={student.isActive ? 'default' : 'secondary'}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(student.createdAt).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStudent(student)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deleteStudentMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {studentsData && studentsData.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, studentsData.total)} of {studentsData.total} students
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {page} of {studentsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === studentsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 