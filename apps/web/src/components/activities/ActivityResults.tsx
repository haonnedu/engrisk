import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Trophy, Clock, Target, Star, RotateCcw, ArrowRight } from 'lucide-react'
import type { Activity } from '../../types/activities'

interface ActivityResultsProps {
  activity: Activity
  score: number
  timeSpent: number
  onRetry: () => void
  onNext: () => void
  onBack: () => void
}

export function ActivityResults({ 
  activity, 
  score, 
  timeSpent, 
  onRetry, 
  onNext, 
  onBack 
}: ActivityResultsProps) {
  const isPassed = score >= 70
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-yellow-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-green-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! Outstanding performance!'
    if (score >= 80) return 'Great job! Well done!'
    if (score >= 70) return 'Good work! Keep it up!'
    return 'Keep practicing! You can do better!'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-blue-600 bg-blue-100'
      case 'advanced': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4">
            {isPassed ? (
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-3xl mb-2">
            {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </CardTitle>
          
          <p className="text-lg text-gray-600 mb-4">
            {getScoreMessage(score)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
              {score}%
            </div>
            <div className="text-sm text-gray-500">
              {score >= 70 ? 'Passed' : 'Not Passed'} • {activity.points} points earned
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{timeSpent}s</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{activity.estimatedTime}m</div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Activity Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Title:</span>
                <span className="text-blue-900">{activity.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Difficulty:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Points:</span>
                <span className="text-blue-900">{activity.points}</span>
              </div>
            </div>
          </div>

          {/* Performance Feedback */}
          {score < 70 && (
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Tips for Improvement</h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Review the lesson materials before retrying</li>
                    <li>• Take your time to read questions carefully</li>
                    <li>• Practice similar exercises to build confidence</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              ← Back to Dashboard
            </Button>
            
            <Button 
              onClick={onRetry}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Activity
            </Button>
            
            {isPassed && (
              <Button 
                onClick={onNext}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Next Activity
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 