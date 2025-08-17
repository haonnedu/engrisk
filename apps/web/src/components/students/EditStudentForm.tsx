import React, { useState, useEffect } from 'react'
import { useUpdateStudent } from '../../hooks/useStudents'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { User, Phone, AlertCircle, ArrowLeft, Save } from 'lucide-react'

interface Student {
  id: string
  name: string
  phone: string
  role: 'student'
  avatar?: string
  isActive: boolean
}

interface EditStudentFormProps {
  student: Student
  onSuccess: () => void
  onCancel: () => void
}

export function EditStudentForm({ student, onSuccess, onCancel }: EditStudentFormProps) {
  const [formData, setFormData] = useState({
    name: student.name,
    phone: student.phone,
    role: student.role,
    avatar: student.avatar || '',
    isActive: student.isActive
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const updateStudentMutation = useUpdateStudent()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!formData.name || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }

    try {
      await updateStudentMutation.mutateAsync({
        id: student.id,
        data: formData
      })
      setSuccessMessage('Student updated successfully!')
      // Don't redirect, stay on the form
      setTimeout(() => setSuccessMessage(''), 3000) // Hide success message after 3 seconds
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while updating student')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Student Management</span>
          </Button>
          <h1 className="text-3xl font-bold">Edit Student</h1>
          <p className="text-gray-600">Update information for {student.name}</p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Student Information</span>
            </CardTitle>
            <CardDescription>
              Edit student information and save changes
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

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter student's full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Example: 0123456789 or +84123456789
                </p>
              </div>

              {/* Role - Hidden since students can only be students */}
              <input type="hidden" value="student" />

              {/* Active Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Active Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={formData.isActive === true}
                      onChange={() => handleInputChange('isActive', true)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={formData.isActive === false}
                      onChange={() => handleInputChange('isActive', false)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                  Avatar URL
                </label>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use default avatar
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={updateStudentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateStudentMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updateStudentMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
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