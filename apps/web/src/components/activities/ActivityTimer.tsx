import { useState, useEffect } from 'react'
import { Clock, Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'

interface ActivityTimerProps {
  estimatedTime: number // in minutes
  onTimeUpdate: (timeSpent: number) => void
  isPaused?: boolean
  onPauseToggle?: () => void
}

export function ActivityTimer({ 
  estimatedTime, 
  onTimeUpdate, 
  isPaused = false, 
  onPauseToggle 
}: ActivityTimerProps) {
  const [timeSpent, setTimeSpent] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    let interval: number | null = null

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1
          onTimeUpdate(newTime)
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, onTimeUpdate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatEstimatedTime = (minutes: number) => {
    return `${minutes}m`
  }

  const handlePauseToggle = () => {
    if (onPauseToggle) {
      onPauseToggle()
    } else {
      setIsRunning(!isRunning)
    }
  }

  const handleReset = () => {
    setTimeSpent(0)
    onTimeUpdate(0)
  }

  const getTimeColor = () => {
    const timeRatio = timeSpent / (estimatedTime * 60)
    if (timeRatio > 1.5) return 'text-red-600'
    if (timeRatio > 1.2) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Time:</span>
        <span className={`text-lg font-bold ${getTimeColor()}`}>
          {formatTime(timeSpent)}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Estimated:</span>
        <span className="text-sm font-medium text-gray-700">
          {formatEstimatedTime(estimatedTime)}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {onPauseToggle ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseToggle}
            className="h-8 px-3"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 mr-1" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseToggle}
            className="h-8 px-3"
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Resume
              </>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="h-8 px-3"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex-1 max-w-xs">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              timeSpent > estimatedTime * 60 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ 
              width: `${Math.min((timeSpent / (estimatedTime * 60)) * 100, 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
} 