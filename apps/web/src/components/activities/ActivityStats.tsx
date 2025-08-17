import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Star, 
  Award,
  Calendar,
  Zap
} from 'lucide-react'

interface ActivityStatsProps {
  totalActivities: number
  completedActivities: number
  totalPoints: number
  earnedPoints: number
  averageScore: number
  totalTimeSpent: number
  streakDays: number
  bestScore: number
  recentScores: number[]
}

export function ActivityStats({
  totalActivities,
  completedActivities,
  totalPoints,
  earnedPoints,
  averageScore,
  totalTimeSpent,
  streakDays,
  bestScore,
  recentScores
}: ActivityStatsProps) {
  const completionRate = (completedActivities / totalActivities) * 100
  const pointsRate = (earnedPoints / totalPoints) * 100

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-yellow-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-green-600'
    return 'text-red-600'
  }

  const getStreakColor = (days: number) => {
    if (days >= 7) return 'text-orange-600'
    if (days >= 3) return 'text-blue-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedActivities} of {totalActivities} activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedPoints}</div>
            <Progress value={pointsRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(pointsRate)}% of {totalPoints} total points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
              {Math.round(averageScore)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStreakColor(streakDays)}`}>
              {streakDays} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Time and Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Time & Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Time Spent</span>
              <span className="font-medium">{formatTime(totalTimeSpent)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Score</span>
              <span className={`font-medium ${getScoreColor(bestScore)}`}>
                {bestScore}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Activities Today</span>
              <span className="font-medium">{recentScores.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Recent Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentScores.length > 0 ? (
              <div className="space-y-3">
                {recentScores.slice(-5).map((score, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Activity {index + 1}</span>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={score} 
                        className="w-20 h-2" 
                      />
                      <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activities
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg border-2 ${
              completionRate >= 100 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                completionRate >= 100 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Trophy className={`w-6 h-6 ${
                  completionRate >= 100 ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <h4 className="font-medium mb-1">Completion Master</h4>
              <p className="text-sm text-gray-600">Complete all activities</p>
            </div>

            <div className={`text-center p-4 rounded-lg border-2 ${
              averageScore >= 90 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                averageScore >= 90 ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                <Star className={`w-6 h-6 ${
                  averageScore >= 90 ? 'text-yellow-600' : 'text-gray-400'
                }`} />
              </div>
              <h4 className="font-medium mb-1">High Achiever</h4>
              <p className="text-sm text-gray-600">Average score ≥ 90%</p>
            </div>

            <div className={`text-center p-4 rounded-lg border-2 ${
              streakDays >= 7 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                streakDays >= 7 ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <Zap className={`w-6 h-6 ${
                  streakDays >= 7 ? 'text-orange-600' : 'text-gray-400'
                }`} />
              </div>
              <h4 className="font-medium mb-1">Streak Master</h4>
              <p className="text-sm text-gray-600">7+ day learning streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 