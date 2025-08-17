import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Shuffle, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react'
import type { MatchingActivity, MatchingPair } from '../../types/activities'

interface MatchingActivityProps {
  activity: MatchingActivity
  onComplete: (score: number, timeSpent: number) => void
}

export function MatchingActivity({ activity, onComplete }: MatchingActivityProps) {
  const [leftItems, setLeftItems] = useState<MatchingPair[]>([])
  const [rightItems, setRightItems] = useState<MatchingPair[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit ? activity.timeLimit * 60 : null)

  // Initialize items with shuffle logic
  useEffect(() => {
    const pairs = [...activity.matchingPairs]
    
    // Apply shuffle to left items if shuffle is enabled
    const leftShuffled = pairs.map(pair => ({
      ...pair,
      shuffle: pair.shuffle
    }))
    
    // Apply shuffle to right items
    const rightShuffled = pairs.map(pair => ({
      ...pair,
      shuffle: pair.shuffle
    }))
    
    if (pairs.some(p => p.shuffle)) {
      // Shuffle left items
      leftShuffled.sort(() => Math.random() - 0.5)
      // Shuffle right items
      rightShuffled.sort(() => Math.random() - 0.5)
    }
    
    setLeftItems(leftShuffled)
    setRightItems(rightShuffled)
  }, [activity.matchingPairs])

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

  const handleLeftSelect = (pairId: string) => {
    if (matchedPairs.has(pairId)) return
    
    if (selectedLeft === pairId) {
      setSelectedLeft(null)
    } else {
      setSelectedLeft(pairId)
      // Clear right selection if selecting new left
      if (selectedRight && selectedRight !== pairId) {
        setSelectedRight(null)
      }
    }
  }

  const handleRightSelect = (pairId: string) => {
    if (matchedPairs.has(pairId)) return
    
    if (selectedRight === pairId) {
      setSelectedRight(null)
    } else {
      setSelectedRight(pairId)
      // Clear left selection if selecting new right
      if (selectedLeft && selectedLeft !== pairId) {
        setSelectedLeft(null)
      }
    }
  }

  const checkMatch = () => {
    if (selectedLeft && selectedRight) {
      const leftPair = leftItems.find(item => item.id === selectedLeft)
      const rightPair = rightItems.find(item => item.id === selectedRight)
      
      if (leftPair && rightPair && leftPair.id === rightPair.id) {
        // Correct match
        setMatchedPairs(prev => new Set([...prev, leftPair.id]))
        setSelectedLeft(null)
        setSelectedRight(null)
        
        // Check if all pairs are matched
        if (matchedPairs.size + 1 === activity.matchingPairs.length) {
          completeActivity()
        }
      } else {
        // Wrong match - show feedback and reset after delay
        setTimeout(() => {
          setSelectedLeft(null)
          setSelectedRight(null)
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      checkMatch()
    }
  }, [selectedLeft, selectedRight])

  const completeActivity = () => {
    setIsCompleted(true)
    const score = 100 // Perfect score for matching
    onComplete(score, timeSpent)
  }

  const progress = (matchedPairs.size / activity.matchingPairs.length) * 100

  if (isCompleted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Great Job!</CardTitle>
          <p className="text-gray-600">
            You completed all matches in {timeSpent} seconds
          </p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">Perfect Score: 100%</p>
            <p className="text-green-600 text-sm">All {activity.matchingPairs.length} pairs matched correctly!</p>
          </div>
        </CardHeader>
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
            <span>Progress: {matchedPairs.size}/{activity.matchingPairs.length}</span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click on an item from the left column, then click on its matching pair from the right column. 
            Correct matches will be highlighted in green.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-center mb-4 text-blue-600">Left Side</h3>
            {leftItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  matchedPairs.has(item.id)
                    ? 'bg-green-50 border-green-300 cursor-not-allowed'
                    : selectedLeft === item.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleLeftSelect(item.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.leftText}</span>
                  {matchedPairs.has(item.id) && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-center mb-4 text-green-600">Right Side</h3>
            {rightItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  matchedPairs.has(item.id)
                    ? 'bg-green-50 border-green-300 cursor-not-allowed'
                    : selectedRight === item.id
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleRightSelect(item.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.rightText}</span>
                  {matchedPairs.has(item.id) && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Feedback */}
        {selectedLeft && selectedRight && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-yellow-800">
              Checking match... {selectedLeft === selectedRight ? 'Correct!' : 'Try again!'}
            </p>
          </div>
        )}

        {/* Reset Button */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => {
              setMatchedPairs(new Set())
              setTimeSpent(0)
              setSelectedLeft(null)
              setSelectedRight(null)
              // Re-shuffle if needed
              if (activity.matchingPairs.some(p => p.shuffle)) {
                const pairs = [...activity.matchingPairs]
                const leftShuffled = pairs.map(pair => ({ ...pair }))
                const rightShuffled = pairs.map(pair => ({ ...pair }))
                
                leftShuffled.sort(() => Math.random() - 0.5)
                rightShuffled.sort(() => Math.random() - 0.5)
                
                setLeftItems(leftShuffled)
                setRightItems(rightShuffled)
              }
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 