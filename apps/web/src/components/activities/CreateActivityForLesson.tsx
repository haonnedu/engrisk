import React, { useState } from 'react'
import { useCreateActivity } from '../../hooks/useActivities'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { 
  Target, 
  AlertCircle, 
  Save, 
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface CreateActivityForLessonProps {
  lessonId: string
  lessonTitle: string
  onSuccess: () => void
  onCancel: () => void
}

export function CreateActivityForLesson({ 
  lessonId, 
  lessonTitle, 
  onCancel 
}: CreateActivityForLessonProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz' as 'quiz' | 'matching' | 'fill-blank' | 'listening' | 'speaking' | 'reading',
    points: 10,
    estimatedTime: 5, // minutes
    lessonId: lessonId,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    // Quiz specific fields
    quizQuestions: [{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }],
    // Matching specific fields
    matchingPairs: [{
      left: '',
      right: '',
      shuffle: true
    }],
    // Fill blank specific fields
    fillBlanks: [{
      word: '',
      hint: ''
    }],
    // Other fields
    readingText: '',
    audioUrl: '',
    transcript: '',
    prompt: '',
    targetPhrases: [''],
    recordingTime: 30
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  
  const createActivityMutation = useCreateActivity()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    // Type-specific validation
    switch (formData.type) {
      case 'quiz':
        if (formData.quizQuestions.length === 0) {
          newErrors.quizQuestions = 'At least one quiz question is required'
        } else {
          formData.quizQuestions.forEach((q, index) => {
            if (!q.question.trim()) {
              newErrors[`quizQuestion_${index}`] = 'Question text is required'
            }
            if (q.options.filter(opt => opt.trim()).length < 2) {
              newErrors[`quizOptions_${index}`] = 'At least 2 options are required'
            }
          })
        }
        break
      
      case 'matching':
        if (formData.matchingPairs.length === 0) {
          newErrors.matchingPairs = 'At least one matching pair is required'
        } else {
          formData.matchingPairs.forEach((p, index) => {
            if (!p.left.trim()) {
              newErrors[`matchingLeft_${index}`] = 'Left text is required'
            }
            if (!p.right.trim()) {
              newErrors[`matchingRight_${index}`] = 'Right text is required'
            }
          })
        }
        break
      
      case 'fill-blank':
        if (formData.fillBlanks.length === 0) {
          newErrors.fillBlanks = 'At least one fill blank is required'
        } else {
          formData.fillBlanks.forEach((f, index) => {
            if (!f.word.trim()) {
              newErrors[`fillBlank_${index}`] = 'Word is required'
            }
          })
        }
        break
      
      case 'reading':
        if (!formData.readingText.trim()) {
          newErrors.readingText = 'Reading text is required'
        }
        break
      
      case 'listening':
        if (!formData.audioUrl.trim()) {
          newErrors.audioUrl = 'Audio URL is required'
        }
        break
      
      case 'speaking':
        if (!formData.prompt.trim()) {
          newErrors.prompt = 'Speaking prompt is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleQuizQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.quizQuestions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setFormData(prev => ({ ...prev, quizQuestions: newQuestions }))
    
    // Clear related errors
    const errorKeys = [`quizQuestion_${index}`, `quizOptions_${index}`]
    errorKeys.forEach(key => {
      if (errors[key]) {
        setErrors(prev => ({ ...prev, [key]: '' }))
      }
    })
  }

  const handleQuizOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formData.quizQuestions]
    newQuestions[questionIndex].options[optionIndex] = value
    setFormData(prev => ({ ...prev, quizQuestions: newQuestions }))
    
    // Clear related errors
    const errorKey = `quizOptions_${questionIndex}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }))
    }
  }

  const addQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quizQuestions: [...prev.quizQuestions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }]
    }))
  }

  const removeQuizQuestion = (index: number) => {
    if (formData.quizQuestions.length > 1) {
      const newQuestions = formData.quizQuestions.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, quizQuestions: newQuestions }))
      
      // Clear related errors
      const errorKeys = [`quizQuestion_${index}`, `quizOptions_${index}`]
      errorKeys.forEach(key => {
        if (errors[key]) {
          setErrors(prev => ({ ...prev, [key]: '' }))
        }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    try {
      // Prepare activity data based on type
      const activityData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        points: formData.points,
        estimatedTime: formData.estimatedTime,
        lessonId: formData.lessonId,
        difficulty: formData.difficulty,
      }

      // Add type-specific data
      switch (formData.type) {
        case 'quiz':
          activityData.quizQuestions = formData.quizQuestions.filter(q => 
            q.question.trim() && q.options.filter(opt => opt.trim()).length >= 2
          )
          break
        case 'matching':
          activityData.matchingPairs = formData.matchingPairs.filter(p => 
            p.left.trim() && p.right.trim()
          )
          break
        case 'fill-blank':
          activityData.fillBlanks = formData.fillBlanks.filter(f => f.word.trim())
          break
        case 'reading':
          activityData.readingText = formData.readingText.trim()
          break
        case 'listening':
          activityData.audioUrl = formData.audioUrl.trim()
          activityData.transcript = formData.transcript.trim() || undefined
          break
        case 'speaking':
          activityData.prompt = formData.prompt.trim()
          activityData.targetPhrases = formData.targetPhrases.filter(p => p.trim())
          activityData.recordingTime = formData.recordingTime
          break
      }
      
      console.log('Submitting activity data:', activityData)
      
      await createActivityMutation.mutateAsync(activityData)
      setSuccessMessage('Activity created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'quiz',
        points: 10,
        estimatedTime: 5,
        lessonId: lessonId,
        difficulty: 'beginner',
        quizQuestions: [{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }],
        matchingPairs: [{
          left: '',
          right: '',
          shuffle: true
        }],
        fillBlanks: [{
          word: '',
          hint: ''
        }],
        readingText: '',
        audioUrl: '',
        transcript: '',
        prompt: '',
        targetPhrases: [''],
        recordingTime: 30
      })
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err: any) {
      console.error('Error creating activity:', err)
      const errorMessage = err.response?.data?.message || 'An error occurred while creating the activity'
      setErrors({ submit: errorMessage })
    }
  }

  const renderActivityTypeFields = () => {
    switch (formData.type) {
      case 'quiz':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Quiz Questions <span className="text-red-500">*</span>
              </label>
              {errors.quizQuestions && (
                <p className="text-sm text-red-600 mt-1">{errors.quizQuestions}</p>
              )}
              {formData.quizQuestions.map((question, qIndex) => (
                <div key={qIndex} className="border p-4 rounded-lg mb-4 bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <Input
                        value={question.question}
                        onChange={(e) => handleQuizQuestionChange(qIndex, 'question', e.target.value)}
                        placeholder="Enter question"
                        className={errors[`quizQuestion_${qIndex}`] ? 'border-red-500' : ''}
                      />
                      {errors[`quizQuestion_${qIndex}`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`quizQuestion_${qIndex}`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Options:</label>
                      {errors[`quizOptions_${qIndex}`] && (
                        <p className="text-sm text-red-600">{errors[`quizOptions_${qIndex}`]}</p>
                      )}
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => handleQuizOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === oIndex}
                            onChange={() => handleQuizQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          />
                          <span className="text-sm text-gray-600">Correct</span>
                        </div>
                      ))}
                    </div>
                    
                    <Input
                      value={question.explanation}
                      onChange={(e) => handleQuizQuestionChange(qIndex, 'explanation', e.target.value)}
                      placeholder="Explanation (optional)"
                    />
                    
                    {formData.quizQuestions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuizQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Question
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuizQuestion}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
        )
      
      case 'matching':
        return (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Matching Pairs <span className="text-red-500">*</span>
            </label>
            {errors.matchingPairs && (
              <p className="text-sm text-red-600 mt-1">{errors.matchingPairs}</p>
            )}
            <div className="space-y-2">
              {formData.matchingPairs.map((pair, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      value={pair.left}
                      onChange={(e) => {
                        const newPairs = [...formData.matchingPairs]
                        newPairs[index].left = e.target.value
                        setFormData(prev => ({ ...prev, matchingPairs: newPairs }))
                      }}
                      placeholder="Left side"
                      className={errors[`matchingLeft_${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`matchingLeft_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`matchingLeft_${index}`]}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      value={pair.right}
                      onChange={(e) => {
                        const newPairs = [...formData.matchingPairs]
                        newPairs[index].right = e.target.value
                        setFormData(prev => ({ ...prev, matchingPairs: newPairs }))
                      }}
                      placeholder="Right side"
                      className={errors[`matchingRight_${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`matchingRight_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`matchingRight_${index}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'fill-blank':
        return (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Fill in the Blanks <span className="text-red-500">*</span>
            </label>
            {errors.fillBlanks && (
              <p className="text-sm text-red-600 mt-1">{errors.fillBlanks}</p>
            )}
            <div className="space-y-2">
              {formData.fillBlanks.map((blank, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={blank.word}
                    onChange={(e) => {
                      const newBlanks = [...formData.fillBlanks]
                      newBlanks[index].word = e.target.value
                      setFormData(prev => ({ ...prev, fillBlanks: newBlanks }))
                    }}
                    placeholder="Word to fill"
                    className={errors[`fillBlank_${index}`] ? 'border-red-500' : ''}
                  />
                  <Input
                    value={blank.hint}
                    onChange={(e) => {
                      const newBlanks = [...formData.fillBlanks]
                      newBlanks[index].hint = e.target.value
                      setFormData(prev => ({ ...prev, fillBlanks: newBlanks }))
                    }}
                    placeholder="Hint (optional)"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'reading':
        return (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Reading Text <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.readingText}
              onChange={(e) => handleInputChange('readingText', e.target.value)}
              placeholder="Enter reading text"
              rows={6}
              className={errors.readingText ? 'border-red-500' : ''}
            />
            {errors.readingText && (
              <p className="text-sm text-red-600 mt-1">{errors.readingText}</p>
            )}
          </div>
        )
      
      case 'listening':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Audio URL <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.audioUrl}
                onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                placeholder="Enter audio URL"
                className={errors.audioUrl ? 'border-red-500' : ''}
              />
              {errors.audioUrl && (
                <p className="text-sm text-red-600 mt-1">{errors.audioUrl}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Transcript
              </label>
              <Textarea
                value={formData.transcript}
                onChange={(e) => handleInputChange('transcript', e.target.value)}
                placeholder="Enter transcript (optional)"
                rows={4}
              />
            </div>
          </div>
        )
      
      case 'speaking':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Speaking Prompt <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                placeholder="Enter speaking prompt"
                rows={3}
                className={errors.prompt ? 'border-red-500' : ''}
              />
              {errors.prompt && (
                <p className="text-sm text-red-600 mt-1">{errors.prompt}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Target Phrases
              </label>
              <Textarea
                value={formData.targetPhrases.join(', ')}
                onChange={(e) => handleInputChange('targetPhrases', e.target.value.split(',').map(p => p.trim()))}
                placeholder="Enter target phrases separated by commas"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Recording Time (seconds)
              </label>
              <Input
                type="number"
                min="10"
                max="300"
                value={formData.recordingTime}
                onChange={(e) => handleInputChange('recordingTime', parseInt(e.target.value))}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Lesson</span>
          </Button>
          <h1 className="text-3xl font-bold">Create New Activity</h1>
          <p className="text-gray-600">Add a new activity to lesson: {lessonTitle}</p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Activity Information</span>
            </CardTitle>
            <CardDescription>
              Fill in the activity details to create a new learning exercise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-600">{errors.submit}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-600">{successMessage}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Activity Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter activity title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                  required
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter activity description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                  required
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Type and Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Activity Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="matching">Matching</SelectItem>
                    <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                  </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="points" className="text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Difficulty and Estimated Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <label htmlFor="estimatedTime" className="text-sm font-medium text-gray-700">
                  Estimated Time (minutes)
                </label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Dynamic Fields based on Activity Type */}
              {renderActivityTypeFields()}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={createActivityMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createActivityMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createActivityMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create Activity</span>
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