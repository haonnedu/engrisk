import React, { useState, useEffect } from 'react'
import { useCreateLesson } from '../../hooks/useLessons'
import { useClasses } from '../../hooks/useClasses'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface CreateLessonFormProps {
  teacherId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreateLessonForm: React.FC<CreateLessonFormProps> = ({
  teacherId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 60,
    objectives: [''],
    materials: [''],
    classId: '',
  })

  const createLessonMutation = useCreateLesson()
  const { data: classesData } = useClasses()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.classId) {
      alert('Please select a class')
      return
    }
    
    try {
      // Filter out empty objectives and materials
      const filteredObjectives = formData.objectives.filter(obj => obj.trim().length > 0)
      const filteredMaterials = formData.materials.filter(mat => mat.trim().length > 0)
      
      await createLessonMutation.mutateAsync({
        ...formData,
        objectives: filteredObjectives,
        materials: filteredMaterials,
        classId: formData.classId,
        teacherId,
      })
      
      setFormData({
        title: '',
        description: '',
        difficulty: 'beginner',
        duration: 60,
        objectives: [''],
        materials: [''],
        classId: '',
      })
      
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create lesson:', error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field: 'objectives' | 'materials', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }))
  }

  const addArrayItem = (field: 'objectives' | 'materials') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const removeArrayItem = (field: 'objectives' | 'materials', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Class Selection */}
          <div>
            <label htmlFor="classId" className="block text-sm font-medium mb-2">
              Select Class *
            </label>
            <Select
              value={formData.classId}
              onValueChange={(value) => handleChange('classId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classesData?.data?.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Lesson Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter lesson title"
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
              placeholder="Enter lesson description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
                Difficulty Level
              </label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleChange('difficulty', value as any)}
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
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                Duration (minutes)
              </label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Learning Objectives
            </label>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  value={objective}
                  onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                  placeholder={`Objective ${index + 1}`}
                />
                {formData.objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('objectives', index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('objectives')}
            >
              Add Objective
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Learning Materials
            </label>
            {formData.materials.map((material, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  value={material}
                  onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                  placeholder={`Material ${index + 1}`}
                />
                {formData.materials.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('materials', index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('materials')}
            >
              Add Material
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={createLessonMutation.isPending}
            >
              {createLessonMutation.isPending ? 'Creating...' : 'Create Lesson'}
            </Button>
          </div>

          {createLessonMutation.isError && (
            <div className="text-red-600 text-sm">
              Failed to create lesson. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 