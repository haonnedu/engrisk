import React, { useState } from 'react'
import { useCreateActivity } from '../../hooks/useActivities'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface CreateActivityFormProps {
  lessonId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreateActivityForm: React.FC<CreateActivityFormProps> = ({
  lessonId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    type: 'quiz' as 'quiz' | 'matching' | 'fill-blank' | 'reading' | 'speaking' | 'listening',
    title: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimatedTime: 15,
    points: 10,
    timeLimit: 0,
    readingText: '',
    audioUrl: '',
    transcript: '',
    prompt: '',
    targetPhrases: [''],
  })

  const createActivityMutation = useCreateActivity()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createActivityMutation.mutateAsync({
        ...formData,
        lessonId,
        timeLimit: formData.timeLimit || undefined,
        readingText: formData.readingText || undefined,
        audioUrl: formData.audioUrl || undefined,
        transcript: formData.transcript || undefined,
        prompt: formData.prompt || undefined,
        targetPhrases: formData.targetPhrases.filter(p => p.trim() !== '') || undefined,
      })
      
      setFormData({
        type: 'quiz',
        title: '',
        description: '',
        difficulty: 'beginner',
        estimatedTime: 15,
        points: 10,
        timeLimit: 0,
        readingText: '',
        audioUrl: '',
        transcript: '',
        prompt: '',
        targetPhrases: [''],
      })
      
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create activity:', error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field: 'targetPhrases', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }))
  }

  const addArrayItem = (field: 'targetPhrases') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const removeArrayItem = (field: 'targetPhrases', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'reading':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">
              Reading Text *
            </label>
            <Textarea
              value={formData.readingText}
              onChange={(e) => handleChange('readingText', e.target.value)}
              placeholder="Enter the reading text for this activity"
              rows={6}
              required
            />
          </div>
        )
      
      case 'speaking':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">
              Speaking Prompt *
            </label>
            <Textarea
              value={formData.prompt}
              onChange={(e) => handleChange('prompt', e.target.value)}
              placeholder="Enter the speaking prompt or question"
              rows={3}
              required
            />
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Target Phrases
              </label>
              {formData.targetPhrases.map((phrase, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    value={phrase}
                    onChange={(e) => handleArrayChange('targetPhrases', index, e.target.value)}
                    placeholder={`Target phrase ${index + 1}`}
                  />
                  {formData.targetPhrases.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('targetPhrases', index)}
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
                onClick={() => addArrayItem('targetPhrases')}
              >
                Add Target Phrase
              </Button>
            </div>
          </div>
        )
      
      case 'listening':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Audio URL *
              </label>
              <Input
                value={formData.audioUrl}
                onChange={(e) => handleChange('audioUrl', e.target.value)}
                placeholder="Enter the audio file URL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Transcript
              </label>
              <Textarea
                value={formData.transcript}
                onChange={(e) => handleChange('transcript', e.target.value)}
                placeholder="Enter the audio transcript (optional)"
                rows={4}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Activity Type *
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                  <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Activity Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter activity title"
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
              placeholder="Enter activity description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="estimatedTime" className="block text-sm font-medium mb-2">
                Estimated Time (min)
              </label>
              <Input
                id="estimatedTime"
                type="number"
                min="5"
                max="120"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', parseInt(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="points" className="block text-sm font-medium mb-2">
                Points
              </label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={formData.points}
                onChange={(e) => handleChange('points', parseInt(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium mb-2">
                Time Limit (min)
              </label>
              <Input
                id="timeLimit"
                type="number"
                min="0"
                max="120"
                value={formData.timeLimit}
                onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
                placeholder="0 = no limit"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={createActivityMutation.isPending}
            >
              {createActivityMutation.isPending ? 'Creating...' : 'Create Activity'}
            </Button>
          </div>

          {createActivityMutation.isError && (
            <div className="text-red-600 text-sm">
              Failed to create activity. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 