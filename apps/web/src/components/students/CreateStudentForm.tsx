import React, { useState } from 'react'
import { useCreateStudent } from '../../hooks/useStudents'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { User, Phone, Lock, AlertCircle, ArrowLeft } from 'lucide-react'

interface CreateStudentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateStudentForm({ onSuccess, onCancel }: CreateStudentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'student' as const,
    avatar: ''
  })
  const [error, setError] = useState('')
  
  const createStudentMutation = useCreateStudent()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.phone || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    try {
      await createStudentMutation.mutateAsync(formData)
      // Reset form instead of redirecting
      setFormData({
        name: '',
        phone: '',
        password: '',
        role: 'student',
        avatar: ''
      })
      setError('')
      // Show success message
      alert('Student created successfully!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while creating student')
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
          <h1 className="text-3xl font-bold">Add New Student</h1>
          <p className="text-gray-600">Create a new student account</p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Student Information</span>
            </CardTitle>
            <CardDescription>
              Fill in the required information to create a new student account
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

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Role - Hidden since students can only be students */}
              <input type="hidden" value="student" />

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
                  disabled={createStudentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createStudentMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createStudentMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Student'
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