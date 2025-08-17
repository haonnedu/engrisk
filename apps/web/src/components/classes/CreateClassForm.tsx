import React, { useState } from 'react'
import { useCreateClass } from '../../hooks/useClasses'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface CreateClassFormProps {
  teacherId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreateClassForm: React.FC<CreateClassFormProps> = ({
  teacherId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    maxStudents: 20,
    schedule: '',
  })

  const createClassMutation = useCreateClass()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createClassMutation.mutateAsync({
        ...formData,
        teacherId,
      })
      
      setFormData({
        name: '',
        description: '',
        level: 'beginner',
        maxStudents: 20,
        schedule: '',
      })
      
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create class:', error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Class Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter class name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter class description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-2">
                Level
              </label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange('level', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium mb-2">
                Max Students
              </label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                max="100"
                value={formData.maxStudents}
                onChange={(e) => handleChange('maxStudents', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium mb-2">
              Schedule
            </label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('schedule', e.target.value)}
              placeholder="e.g., Monday, Wednesday 3:00 PM"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={createClassMutation.isPending}
            >
              {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
            </Button>
          </div>

          {createClassMutation.isError && (
            <div className="text-red-600 text-sm">
              Failed to create class. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 