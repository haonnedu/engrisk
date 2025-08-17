import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useClasses, useDeleteClass } from '../../hooks/useClasses'
import { CreateClassForm } from '../../components/classes/CreateClassForm'
import { ClassesList } from '../../components/classes/ClassesList'
import { CreateLessonForClass } from '../../components/lessons/CreateLessonForClass'
import { CreateActivityForLesson } from '../../components/activities/CreateActivityForLesson'
import { ClassStudentsManagement } from '../../components/classes/ClassStudentsManagement'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Navigation } from '../../components/common/Navigation'
import { 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen,
  Target,
  Calendar,
  ArrowLeft
} from 'lucide-react'

interface Class {
  id: string
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  maxStudents: number
  status: 'active' | 'inactive' | 'archived'
  schedule: string
  teacherId: string
  createdAt: string
  updatedAt: string
}

interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  status: 'draft' | 'published' | 'archived'
  objectives: string[]
  materials: string[]
  teacherId: string
  createdAt: string
  updatedAt: string
}

export function ClassesManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateLesson, setShowCreateLesson] = useState(false)
  const [showCreateActivity, setShowCreateActivity] = useState(false)
  const [showManageStudents, setShowManageStudents] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const { user } = useAuth()
  const { data: classesData, isLoading, error } = useClasses()
  const deleteClassMutation = useDeleteClass()

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    // Don't redirect, just close the form
  }

  const handleCreateLessonSuccess = () => {
    setShowCreateLesson(false)
    setSelectedClass(null)
    // Don't redirect, just close the form
  }

  const handleCreateActivitySuccess = () => {
    setShowCreateActivity(false)
    setSelectedLesson(null)
    // Don't redirect, just close the form
  }

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClassMutation.mutateAsync(classId)
        // Success message will be handled by the mutation
      } catch (error) {
        console.error('Failed to delete class:', error)
      }
    }
  }

  const handleCreateLessonForClass = (classData: Class) => {
    setSelectedClass(classData)
    setShowCreateLesson(true)
  }

  const handleCreateActivityForLesson = (lessonData: Lesson) => {
    setSelectedLesson(lessonData)
    setShowCreateActivity(true)
  }

  const handleManageStudents = (classData: Class) => {
    setSelectedClass(classData)
    setShowManageStudents(true)
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <CreateClassForm
            teacherId={user?.id || ''}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </div>
    )
  }

  if (showManageStudents && selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowManageStudents(false)}
              className="mb-4 flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Classes</span>
            </Button>
          </div>
          <ClassStudentsManagement
            classId={selectedClass.id}
            className={selectedClass.name}
          />
        </div>
      </div>
    )
  }

  if (showCreateLesson && selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <CreateLessonForClass
          classId={selectedClass.id}
          className={selectedClass.name}
          teacherId={user?.id || ''}
          onSuccess={handleCreateLessonSuccess}
          onCancel={() => setShowCreateLesson(false)}
        />
      </div>
    )
  }

  if (showCreateActivity && selectedLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <CreateActivityForLesson
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
          onSuccess={handleCreateActivitySuccess}
          onCancel={() => setShowCreateActivity(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Class Management</h1>
            <p className="text-gray-600">Manage your classes and their content</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Class</span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classesData?.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classesData?.data?.filter(c => c.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* TODO: Get total lessons count */}
                  0
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* TODO: Get total activities count */}
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Class</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (classesData?.data && classesData.data.length > 0) {
                  handleCreateLessonForClass(classesData.data[0])
                }
              }}
              disabled={!classesData?.data || classesData.data.length === 0}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Create Lesson for First Class</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement activity creation for first lesson
                alert('Please create a lesson first, then you can add activities to it.')
              }}
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Create Activity</span>
            </Button>
          </div>
        </div>

        {/* Classes List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Class List</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              An error occurred while loading the class list
            </div>
          ) : classesData?.data && classesData.data.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesData.data.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <Badge variant={classItem.status === 'active' ? 'default' : 'secondary'}>
                          {classItem.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Level</p>
                          <p className="font-medium capitalize">{classItem.level}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Max Students</p>
                          <p className="font-medium">{classItem.maxStudents}</p>
                        </div>
                      </div>
                      
                      {classItem.schedule && (
                        <div className="text-sm">
                          <p className="text-gray-600">Schedule</p>
                          <p className="font-medium">{classItem.schedule}</p>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        Created: {new Date(classItem.createdAt).toLocaleDateString('en-US')}
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageStudents(classItem)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Manage Students
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateLessonForClass(classItem)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Add Lesson
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={deleteClassMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No classes yet. Create your first class to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 