import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Play, Pause, RotateCcw, CheckCircle, ArrowLeft, Clock, Target } from 'lucide-react'
import { QuizActivity } from './QuizActivity'
import { MatchingActivity } from './MatchingActivity'
import { FillBlankActivity } from './FillBlankActivity'
import { ListeningActivity } from './ListeningActivity'
import { SpeakingActivity } from './SpeakingActivity'
import { ReadingActivity } from './ReadingActivity'
import { ActivityTimer } from './ActivityTimer'
import { ActivityProgress } from './ActivityProgress'
import type { Activity } from '../../types/activities'

interface ActivityContainerProps {
  activity: Activity
  onComplete: (score: number, timeSpent: number) => void
}

export function ActivityContainer({ activity, onComplete }: ActivityContainerProps) {
  const [isStarted, setIsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const handleStart = () => {
    setIsStarted(true)
    setCurrentStep(1)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsStarted(false)
    setIsPaused(false)
    setTimeSpent(0)
    setCurrentStep(0)
  }

  const handleTimeUpdate = (time: number) => {
    setTimeSpent(time)
  }

  const handleStepUpdate = (step: number) => {
    setCurrentStep(step)
  }

  const getTotalSteps = () => {
    switch (activity.type) {
      case 'quiz':
        return (activity as any).quizQuestions?.length || 0
      case 'matching':
        return (activity as any).matchingPairs?.length || 0
      case 'fill-blank':
        return (activity as any).fillBlanks?.length || 0
      case 'listening':
        return (activity as any).comprehensionQuestions?.length || 0
      case 'reading':
        return (activity as any).comprehensionQuestions?.length || 0
      case 'speaking':
        return 1 // Speaking is just recording
      default:
        return 1
    }
  }

  const getStepLabels = () => {
    const totalSteps = getTotalSteps()
    switch (activity.type) {
      case 'quiz':
        return Array.from({ length: totalSteps }, (_, i) => `Question ${i + 1}`)
      case 'matching':
        return Array.from({ length: totalSteps }, (_, i) => `Pair ${i + 1}`)
      case 'fill-blank':
        return Array.from({ length: totalSteps }, (_, i) => `Blank ${i + 1}`)
      case 'listening':
      case 'reading':
        return Array.from({ length: totalSteps }, (_, i) => `Question ${i + 1}`)
      case 'speaking':
        return ['Record Speech']
      default:
        return []
    }
  }

  const renderActivity = () => {
    const commonProps = {
      onComplete: (score: number, timeSpent: number) => {
        onComplete(score, timeSpent)
        setCurrentStep(0)
      },
      onStepUpdate: handleStepUpdate,
      isPaused
    }

    switch (activity.type) {
      case 'quiz':
        return <QuizActivity activity={activity as any} {...commonProps} />
      case 'matching':
        return <MatchingActivity activity={activity as any} {...commonProps} />
      case 'fill-blank':
        return <FillBlankActivity activity={activity as any} {...commonProps} />
      case 'listening':
        return <ListeningActivity activity={activity as any} {...commonProps} />
      case 'speaking':
        return <SpeakingActivity activity={activity as any} {...commonProps} />
      case 'reading':
        return <ReadingActivity activity={activity as any} {...commonProps} />
      default:
        return (
          <div className="text-center p-8">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Activity type not supported yet</p>
          </div>
        )
    }
  }

  const getActivityTypeIcon = () => {
    switch (activity.type) {
      case 'quiz':
        return '📝'
      case 'matching':
        return '🔗'
      case 'fill-blank':
        return '✏️'
      case 'listening':
        return '🎧'
      case 'speaking':
        return '🎤'
      case 'reading':
        return '📖'
      default:
        return '🎯'
    }
  }

  const getActivityTypeDescription = () => {
    switch (activity.type) {
      case 'quiz':
        return 'Multiple choice questions with correct answers'
      case 'matching':
        return 'Match items from two columns'
      case 'fill-blank':
        return 'Fill in the missing words'
      case 'listening':
        return 'Audio-based comprehension activities'
      case 'speaking':
        return 'Oral practice and pronunciation exercises'
      case 'reading':
        return 'Reading comprehension and vocabulary practice'
      default:
        return 'Interactive learning activity'
    }
  }

  if (!isStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">{getActivityTypeIcon()}</div>
          <CardTitle className="text-2xl">{activity.title}</CardTitle>
          <p className="text-gray-600">{activity.description}</p>
          <p className="text-sm text-blue-600 mt-2">{getActivityTypeDescription()}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600 capitalize">{activity.difficulty}</div>
              <div className="text-sm text-blue-600">Difficulty</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{activity.estimatedTime}m</div>
              <div className="text-sm text-green-600">Estimated Time</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">{activity.points}</div>
              <div className="text-sm text-purple-600">Points</div>
            </div>
          </div>

          {activity.timeLimit && (
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  Time limit: {activity.timeLimit} minutes
                </span>
              </div>
            </div>
          )}
          
          <Button onClick={handleStart} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Activity
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Activity Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getActivityTypeIcon()}</span>
                <CardTitle className="text-xl">{activity.title}</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.difficulty} • {activity.points} points • {activity.estimatedTime}m estimated
                {activity.timeLimit && ` • ${activity.timeLimit}m time limit`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStarted(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Info
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Timer */}
          <ActivityTimer
            estimatedTime={activity.estimatedTime}
            onTimeUpdate={handleTimeUpdate}
            isPaused={isPaused}
            onPauseToggle={handlePause}
          />
          
          {/* Progress */}
          {getTotalSteps() > 1 && (
            <ActivityProgress
              currentStep={currentStep}
              totalSteps={getTotalSteps()}
              stepLabels={getStepLabels()}
              variant="compact"
            />
          )}
        </CardContent>
      </Card>

      {/* Activity Content */}
      {renderActivity()}
    </div>
  )
} 