import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { CheckCircle, XCircle, RotateCcw, Clock, Play, Pause, Volume2 } from 'lucide-react'
import type { ListeningActivity } from '../../types/activities'

interface ListeningActivityProps {
  activity: ListeningActivity
  onComplete: (score: number, timeSpent: number) => void
}

export function ListeningActivity({ activity, onComplete }: ListeningActivityProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit ? activity.timeLimit * 60 : null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [hasListened, setHasListened] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Timer effect
  useEffect(() => {
    if (!isCompleted && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev <= 1) {
            // Time's up - auto complete
            completeActivity()
            return 0
          }
          return prev !== null ? prev - 1 : null
        })
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isCompleted, timeRemaining])

  // Audio progress tracking
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setHasListened(true)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < (activity.comprehensionQuestions?.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeActivity()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeActivity = () => {
    if (!activity.comprehensionQuestions || activity.comprehensionQuestions.length === 0) {
      // No questions - just listening activity
      const score = hasListened ? 100 : 0
      setIsCompleted(true)
      setShowResults(true)
      onComplete(score, timeSpent)
      return
    }

    const correctAnswers = activity.comprehensionQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / activity.comprehensionQuestions.length) * 100)
    setIsCompleted(true)
    setShowResults(true)
    onComplete(score, timeSpent)
  }

  const currentQuestionData = activity.comprehensionQuestions?.[currentQuestion]
  const progress = activity.comprehensionQuestions 
    ? ((currentQuestion + 1) / activity.comprehensionQuestions.length) * 100
    : 0
  const hasAnsweredCurrent = currentQuestionData ? selectedAnswers[currentQuestion] !== undefined : true

  if (showResults) {
    if (!activity.comprehensionQuestions || activity.comprehensionQuestions.length === 0) {
      // Listening only activity
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4">
              {hasListened ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {hasListened ? 'Great Listening!' : 'Please Listen to the Audio'}
            </CardTitle>
            <p className="text-gray-600">
              {hasListened 
                ? 'You completed the listening activity successfully!' 
                : 'You need to listen to the audio to complete this activity.'
              }
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                {hasListened ? '✅ Audio listened' : '❌ Audio not listened'}
              </p>
              <p className="text-blue-600 text-sm mt-2">
                Time spent: {timeSpent} seconds
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Quiz questions after listening
    const correctAnswers = activity.comprehensionQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / activity.comprehensionQuestions.length) * 100)
    const isPassed = score >= 70

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4">
            {isPassed ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isPassed ? 'Excellent Comprehension!' : 'Keep Practicing!'}
          </CardTitle>
          <p className="text-gray-600">
            You scored {score}% ({correctAnswers}/{activity.comprehensionQuestions.length} correct)
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
            {activity.comprehensionQuestions.map((question, index) => {
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
            <span>Time: {timeSpent}s</span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Player */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <Volume2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-medium">Listen to the Audio</h3>
          </div>
          
          <audio ref={audioRef} src={activity.audioUrl} preload="metadata" />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                variant={isPlaying ? "outline" : "default"}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(audioProgress)}%</span>
                </div>
                <Progress value={audioProgress} className="w-full" />
              </div>
            </div>
            
            {hasListened && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Audio listened successfully! You can now proceed to answer questions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transcript (optional) */}
        {activity.transcript && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Transcript (Optional Reference)</h4>
            <p className="text-sm text-blue-700 leading-relaxed">{activity.transcript}</p>
          </div>
        )}

        {/* Comprehension Questions */}
        {activity.comprehensionQuestions && activity.comprehensionQuestions.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Comprehension Questions</h3>
            
            <div>
              <h4 className="text-md font-medium mb-4">
                Question {currentQuestion + 1} of {activity.comprehensionQuestions.length}
              </h4>
              <div className="space-y-4">
                <p className="text-lg">{currentQuestionData?.question}</p>
                
                <div className="space-y-3">
                  {currentQuestionData?.options.map((option, index) => (
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
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
              >
                {currentQuestion === (activity.comprehensionQuestions?.length || 0) - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}

        {/* Complete Button for listening-only activities */}
        {(!activity.comprehensionQuestions || activity.comprehensionQuestions.length === 0) && (
          <div className="text-center">
            <Button
              onClick={completeActivity}
              disabled={!hasListened}
              className="min-w-[120px]"
            >
              Complete Activity
            </Button>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedAnswers([])
              setTimeSpent(0)
              setShowResults(false)
              setIsCompleted(false)
              setCurrentQuestion(0)
              setHasListened(false)
              setAudioProgress(0)
              if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.pause()
                setIsPlaying(false)
              }
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 