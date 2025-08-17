import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { CheckCircle, XCircle, Clock, Trophy, ArrowRight, ArrowLeft } from 'lucide-react'
import type { QuizActivity } from '../../types/activities'

interface QuizActivityProps {
  activity: QuizActivity
  onComplete: (score: number, timeSpent: number) => void
}

export function QuizActivity({ activity, onComplete }: QuizActivityProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit ? activity.timeLimit * 60 : null)

  // Timer effect
  useEffect(() => {
    if (!isCompleted && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev <= 1) {
            // Time's up - auto complete
            completeQuiz()
            return 0
          }
          return prev !== null ? prev - 1 : null
        })
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isCompleted, timeRemaining])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < activity.quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeQuiz = () => {
    const correctAnswers = activity.quizQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / activity.quizQuestions.length) * 100)
    setIsCompleted(true)
    setShowResults(true)
    onComplete(score, timeSpent)
  }

  const currentQuestionData = activity.quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / activity.quizQuestions.length) * 100
  const hasAnsweredCurrent = selectedAnswers[currentQuestion] !== undefined

  if (showResults) {
    const correctAnswers = activity.quizQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / activity.quizQuestions.length) * 100)
    const isPassed = score >= 70

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4">
            {isPassed ? (
              <Trophy className="w-12 h-12 text-yellow-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </CardTitle>
          <p className="text-gray-600">
            You scored {score}% ({correctAnswers}/{activity.quizQuestions.length} correct)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-600">Score</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{timeSpent}s</div>
              <div className="text-sm text-green-600">Time Spent</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Review Answers:</h4>
            {activity.quizQuestions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer
              const userAnswer = selectedAnswers[index]
              return (
                <div key={question.id} className={`p-3 rounded border ${
                  isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <p className="text-sm mb-2">{question.question}</p>
                  <p className="text-xs text-gray-600">
                    Your answer: {userAnswer !== undefined ? question.options[userAnswer] : '(not answered)'}
                  </p>
                  {!isCorrect && userAnswer !== undefined && (
                    <p className="text-xs text-green-600">
                      Correct: {question.options[question.correctAnswer]}
                    </p>
                  )}
                  {question.explanation && (
                    <p className="text-xs text-blue-600 mt-1">
                      {question.explanation}
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
    <Card className="max-w-2xl mx-auto">
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
            <span>Question {currentQuestion + 1} of {activity.quizQuestions.length}</span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestionData.question}</h3>
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="mr-3 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={handlePrevious}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
          >
            {currentQuestion === activity.quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2 justify-center">
          {activity.quizQuestions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestion ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 p-0 ${
                selectedAnswers[index] !== undefined ? 'bg-green-100 border-green-300' : ''
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 