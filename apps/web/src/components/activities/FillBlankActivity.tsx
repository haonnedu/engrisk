import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Progress } from '../ui/progress'
import { CheckCircle, XCircle, RotateCcw, Clock, BookOpen } from 'lucide-react'
import type { FillBlankActivity } from '../../types/activities'

interface FillBlankActivityProps {
  activity: FillBlankActivity
  onComplete: (score: number, timeSpent: number) => void
}

export function FillBlankActivity({ activity, onComplete }: FillBlankActivityProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit ? activity.timeLimit * 60 : null)

  // Timer effect
  useEffect(() => {
    if (!isCompleted && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev <= 1) {
            // Time's up - auto complete
            checkAnswers()
            return 0
          }
          return prev !== null ? prev - 1 : null
        })
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isCompleted, timeRemaining])

  const handleAnswerChange = (blankId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }))
  }

  const checkAnswers = () => {
    setShowResults(true)
    setIsCompleted(true)
    
    const correctAnswers = activity.fillBlanks.reduce((count, blank) => {
      const userAnswer = answers[blank.id] || ''
      return count + (userAnswer.toLowerCase().trim() === blank.word.toLowerCase().trim() ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / activity.fillBlanks.length) * 100)
    onComplete(score, timeSpent)
  }

  const renderTextWithBlanks = () => {
    if (!activity.readingText) {
      // If no reading text, show blanks in a list format
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Fill in the blanks:</h3>
          {activity.fillBlanks.map((blank, index) => (
            <div key={blank.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <span className="font-medium min-w-[100px]">Blank {index + 1}:</span>
              <Input
                placeholder="Type your answer"
                value={answers[blank.id] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(blank.id, e.target.value)}
                className={`flex-1 ${
                  showResults
                    ? answers[blank.id]?.toLowerCase().trim() === blank.word.toLowerCase().trim()
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : ''
                }`}
                disabled={showResults}
              />
              {blank.hint && (
                <span className="text-sm text-gray-500 min-w-[200px]">
                  Hint: {blank.hint}
                </span>
              )}
            </div>
          ))}
        </div>
      )
    }

    // If there's reading text, embed blanks within it
    let currentIndex = 0
    const parts = []
    
    for (let i = 0; i < activity.fillBlanks.length; i++) {
      const blank = activity.fillBlanks[i]
      const textBeforeBlank = activity.readingText.slice(currentIndex, activity.readingText.indexOf('___', currentIndex))
      
      if (textBeforeBlank) {
        parts.push(<span key={`text-${i}`}>{textBeforeBlank}</span>)
      }
      
      parts.push(
        <Input
          key={`blank-${i}`}
          placeholder="Type your answer"
          value={answers[blank.id] || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(blank.id, e.target.value)}
          className={`inline-block w-32 mx-2 ${
            showResults
              ? answers[blank.id]?.toLowerCase().trim() === blank.word.toLowerCase().trim()
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : ''
          }`}
          disabled={showResults}
        />
      )
      
      currentIndex = activity.readingText.indexOf('___', currentIndex) + 3
    }
    
    const remainingText = activity.readingText.slice(currentIndex)
    if (remainingText) {
      parts.push(<span key="text-end">{remainingText}</span>)
    }
    
    return (
      <div className="text-lg leading-relaxed">
        {parts}
      </div>
    )
  }

  const progress = Object.keys(answers).length / activity.fillBlanks.length * 100
  const allAnswered = Object.keys(answers).length === activity.fillBlanks.length

  if (isCompleted && showResults) {
    const correctAnswers = activity.fillBlanks.reduce((count, blank) => {
      const userAnswer = answers[blank.id] || ''
      return count + (userAnswer.toLowerCase().trim() === blank.word.toLowerCase().trim() ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / activity.fillBlanks.length) * 100)

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4">
            {score >= 70 ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {score >= 70 ? 'Well Done!' : 'Keep Practicing!'}
          </CardTitle>
          <p className="text-gray-600">
            You scored {score}% ({correctAnswers}/{activity.fillBlanks.length} correct)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-semibold">Review Answers:</h4>
            {activity.fillBlanks.map((blank, index) => {
              const userAnswer = answers[blank.id] || ''
              const isCorrect = userAnswer.toLowerCase().trim() === blank.word.toLowerCase().trim()
              
              return (
                <div key={blank.id} className={`p-3 rounded border ${
                  isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">Blank {index + 1}</span>
                  </div>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Your answer:</span> {userAnswer || '(empty)'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-green-600">
                      <span className="font-medium">Correct answer:</span> {blank.word}
                    </p>
                  )}
                  {blank.hint && (
                    <p className="text-xs text-blue-600 mt-1">
                      <span className="font-medium">Hint:</span> {blank.hint}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>{activity.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            {timeRemaining !== null && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className={timeRemaining <= 30 ? 'text-red-600 font-semibold' : ''}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <span>Progress: {Object.keys(answers).length}/{activity.fillBlanks.length}</span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Fill in the blanks with the correct words. 
            {activity.readingText ? ' Read the text and fill in the blanks marked with ___.' : ' Use the hints if available.'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderTextWithBlanks()}
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={checkAnswers}
            disabled={!allAnswered}
            className="min-w-[120px]"
          >
            Check Answers
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({})
              setTimeSpent(0)
              setShowResults(false)
              setIsCompleted(false)
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {allAnswered ? '✅ All blanks filled!' : `${activity.fillBlanks.length - Object.keys(answers).length} more to go`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 