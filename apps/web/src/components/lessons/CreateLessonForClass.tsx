import React, { useState } from 'react'
import { useCreateLesson } from '../../hooks/useLessons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { BookOpen, AlertCircle, Save, ArrowLeft } from 'lucide-react'

interface CreateLessonForClassProps {
  classId: string
  className: string
  teacherId: string
  onSuccess: () => void
  onCancel: () => void
}

export function CreateLessonForClass({ 
  classId, 
  className, 
  teacherId, 
  onSuccess, 
  onCancel 
}: CreateLessonForClassProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 60,
    objectives: '',
    materials: '',
    classId: classId,
    teacherId: teacherId
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const createLessonMutation = useCreateLesson()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields')
      return
    }

    try {
      // Convert objectives and materials to arrays, supporting both comma and newline separation
      const lessonData = {
        ...formData,
        objectives: formData.objectives 
          ? formData.objectives
              .split(/[\n,]+/) // Split by newline or comma
              .map(obj => obj.trim())
              .filter(obj => obj.length > 0)
          : [],
        materials: formData.materials 
          ? formData.materials
              .split(/[\n,]+/) // Split by newline or comma
              .map(mat => mat.trim())
              .filter(mat => mat.length > 0)
          : []
      }
      
      console.log('Submitting lesson data:', lessonData) // Debug log
      console.log('Objectives array:', lessonData.objectives) // Debug objectives
      console.log('Materials array:', lessonData.materials) // Debug materials
      
      await createLessonMutation.mutateAsync(lessonData)
      setSuccessMessage('Lesson created successfully!')
      // Reset form instead of redirecting
      setFormData({
        title: '',
        description: '',
        difficulty: 'beginner',
        duration: 60,
        objectives: '',
        materials: '',
        classId: classId,
        teacherId: teacherId
      })
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err: any) {
      console.error('Error creating lesson:', err) // Debug log
      setError(err.response?.data?.message || 'An error occurred while creating the lesson')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Class Management</span>
          </Button>
          <h1 className="text-3xl font-bold">Create New Lesson</h1>
          <p className="text-gray-600">Add a new lesson to class: {className}</p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Lesson Information</span>
            </CardTitle>
            <CardDescription>
              Fill in the lesson details to create a new learning session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-600">{successMessage}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Lesson Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter lesson title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter lesson description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
                  Difficulty Level
                </label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="180"
                  step="15"
                  placeholder="60"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">
                  Duration in minutes (15-180 minutes)
                </p>
              </div>

              {/* Objectives */}
              <div className="space-y-2">
                <label htmlFor="objectives" className="text-sm font-medium text-gray-700">
                  Learning Objectives
                </label>
                <Textarea
                  id="objectives"
                  placeholder="Enter learning objectives (separate with commas or new lines)"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Enter objectives separated by commas or new lines (e.g., "Understand basics, Practice skills" or one per line)
                </p>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <label htmlFor="materials" className="text-sm font-medium text-gray-700">
                  Required Materials
                </label>
                <Textarea
                  id="materials"
                  placeholder="Enter required materials (separate with commas or new lines)"
                  value={formData.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Enter materials separated by commas or new lines (e.g., "Pencil, Paper, Textbook" or one per line)
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={createLessonMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLessonMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createLessonMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create Lesson</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 