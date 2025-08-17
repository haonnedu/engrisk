import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useClasses } from '../../hooks/useClasses'
import { useLessons } from '../../hooks/useLessons'
import { CreateLessonForm } from '../../components/lessons/CreateLessonForm'
import { CreateActivityForLesson } from '../../components/lessons/CreateActivityForLesson'
import { LessonsList } from '../../components/lessons/LessonsList'
import { Button } from '../../components/ui/button'
import { Navigation } from '../../components/common/Navigation'
import { Plus, BookOpen, Target } from 'lucide-react'

export function LessonsManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateActivity, setShowCreateActivity] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const { user } = useAuth()
  const { data: classesData } = useClasses(1, 100)
  const { data: lessonsData } = useLessons(1, 100)

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    setSelectedClassId('')
  }

  const handleCreateActivity = (lesson: any) => {
    setSelectedLesson(lesson)
    setShowCreateActivity(true)
  }

  const handleCreateActivitySuccess = () => {
    setShowCreateActivity(false)
    setSelectedLesson(null)
  }

  const handleEditLesson = (lessonId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit lesson:', lessonId)
  }

  const handleViewLesson = (lessonId: string) => {
    // TODO: Implement view functionality
    console.log('View lesson:', lessonId)
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <CreateLessonForm
            teacherId={user?.id || ''}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </div>
    )
  }

  if (showCreateActivity && selectedLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <CreateActivityForLesson
            lessonId={selectedLesson.id}
            lessonTitle={selectedLesson.title}
            onSuccess={handleCreateActivitySuccess}
            onCancel={() => setShowCreateActivity(false)}
          />
        </div>
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
            <h1 className="text-3xl font-bold">Quản lý bài học</h1>
            <p className="text-gray-600">Tạo và quản lý các bài học của bạn</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="flex items-center space-x-2"
            disabled={!classesData?.data?.length}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo bài học mới</span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số bài học</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessonsData?.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Bài học đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessonsData?.data?.filter(l => l.status === 'published').length || 0}
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
                <p className="text-sm font-medium text-gray-600">Bài học nháp</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessonsData?.data?.filter(l => l.status === 'draft').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection for Create Lesson */}
        {!showCreateForm && classesData?.data?.length && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h3 className="text-lg font-semibold mb-4">Chọn lớp để tạo bài học</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classesData.data.map((classItem) => (
                <div
                  key={classItem.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedClassId === classItem.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedClassId(classItem.id)}
                >
                  <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                  <p className="text-sm text-gray-600">{classItem.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {classItem.level}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {classItem.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {selectedClassId && (
              <div className="mt-4">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tạo bài học cho lớp này</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Danh sách bài học</h2>
          </div>
          <LessonsList
            onEditLesson={handleEditLesson}
            onViewLesson={handleViewLesson}
            onCreateActivity={handleCreateActivity}
          />
        </div>
      </div>
    </div>
  )
} 