import { Progress } from '../ui/progress'
import { CheckCircle, Circle, Clock } from 'lucide-react'

interface ActivityProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
  showLabels?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function ActivityProgress({ 
  currentStep, 
  totalSteps, 
  stepLabels = [], 
  showLabels = true,
  variant = 'default'
}: ActivityProgressProps) {
  const progress = (currentStep / totalSteps) * 100
  const isCompleted = currentStep >= totalSteps

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    } else if (stepIndex === currentStep) {
      return <Clock className="w-5 h-5 text-blue-600" />
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'pending'
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{currentStep} of {totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        
        <Progress value={progress} className="h-3" />
        
        {showLabels && stepLabels.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {stepLabels.map((label, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  getStepStatus(index) === 'completed' 
                    ? 'bg-green-50 border-green-200' 
                    : getStepStatus(index) === 'current'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {getStepIcon(index)}
                <span className={`text-sm font-medium ${
                  getStepStatus(index) === 'completed' 
                    ? 'text-green-800' 
                    : getStepStatus(index) === 'current'
                    ? 'text-blue-800'
                    : 'text-gray-600'
                }`}>
                  {label || `Step ${index + 1}`}
                </span>
                {getStepStatus(index) === 'completed' && (
                  <span className="ml-auto text-xs text-green-600 font-medium">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-500">{currentStep} of {totalSteps}</span>
      </div>
      
      <Progress value={progress} className="h-3" />
      
      {showLabels && stepLabels.length > 0 && (
        <div className="flex items-center justify-between">
          {stepLabels.map((label, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center space-y-2 ${
                getStepStatus(index) === 'completed' ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {getStepIcon(index)}
              <span className="text-xs text-center max-w-20 truncate">
                {label || `Step ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {isCompleted && (
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-green-800">
            Activity completed! Great job!
          </span>
        </div>
      )}
    </div>
  )
} 