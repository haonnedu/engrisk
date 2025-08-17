import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { CheckCircle, XCircle, RotateCcw, Clock, Mic, MicOff, Play, Pause, Volume2 } from 'lucide-react'
import type { SpeakingActivity } from '../../types/activities'

interface SpeakingActivityProps {
  activity: SpeakingActivity
  onComplete: (score: number, timeSpent: number) => void
}

export function SpeakingActivity({ activity, onComplete }: SpeakingActivityProps) {
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit ? activity.timeLimit * 60 : null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlayingRecording, setIsPlayingRecording] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
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

  // Recording timer
  useEffect(() => {
    if (isRecording && activity.recordingTime) {
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= activity.recordingTime!) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isRecording, activity.recordingTime])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        setHasRecorded(true)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlayingRecording) {
        audioRef.current.pause()
        setIsPlayingRecording(false)
      } else {
        audioRef.current.play()
        setIsPlayingRecording(true)
      }
    }
  }

  const completeActivity = () => {
    const score = hasRecorded ? 100 : 0
    setIsCompleted(true)
    setShowResults(true)
    onComplete(score, timeSpent)
  }

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4">
            {hasRecorded ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {hasRecorded ? 'Great Speaking Practice!' : 'Please Record Your Speech'}
          </CardTitle>
          <p className="text-gray-600">
            {hasRecorded 
              ? 'You completed the speaking activity successfully!' 
              : 'You need to record your speech to complete this activity.'
            }
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              {hasRecorded ? '✅ Speech recorded' : '❌ Speech not recorded'}
            </p>
            <p className="text-blue-600 text-sm mt-2">
              Time spent: {timeSpent} seconds
            </p>
            {hasRecorded && (
              <p className="text-blue-600 text-sm">
                Recording duration: {recordingTime} seconds
              </p>
            )}
          </div>

          {hasRecorded && audioUrl && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Your Recording</h4>
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlayingRecording(false)} />
              <Button
                onClick={playRecording}
                variant="outline"
                className="mr-2"
              >
                {isPlayingRecording ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlayingRecording ? 'Pause' : 'Play'} Recording
              </Button>
            </div>
          )}
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
        <Progress value={0} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Speaking Prompt */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-4">Speaking Prompt</h3>
          <p className="text-lg leading-relaxed text-blue-700">{activity.prompt}</p>
        </div>

        {/* Target Phrases */}
        {activity.targetPhrases && activity.targetPhrases.length > 0 && (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-4">Target Phrases to Use</h3>
            <div className="flex flex-wrap gap-2">
              {activity.targetPhrases.map((phrase, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {phrase}
                </span>
              ))}
            </div>
            <p className="text-sm text-green-600 mt-3">
              Try to incorporate these phrases naturally into your speech.
            </p>
          </div>
        )}

        {/* Recording Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Record Your Speech</h3>
          
          <div className="space-y-4">
            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={hasRecorded}
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <Mic className="w-8 h-8" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-gray-600 hover:bg-gray-700"
                >
                  <MicOff className="w-8 h-8" />
                </Button>
              )}
            </div>

            {/* Recording Status */}
            <div className="text-center">
              {isRecording ? (
                <div className="space-y-2">
                  <p className="text-red-600 font-medium">Recording...</p>
                  {activity.recordingTime && (
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {recordingTime}s / {activity.recordingTime}s
                      </span>
                    </div>
                  )}
                  <Progress 
                    value={activity.recordingTime ? (recordingTime / activity.recordingTime) * 100 : 0} 
                    className="w-full max-w-xs mx-auto" 
                  />
                </div>
              ) : hasRecorded ? (
                <div className="space-y-2">
                  <p className="text-green-600 font-medium">Recording Complete!</p>
                  <p className="text-sm text-gray-600">
                    Duration: {recordingTime} seconds
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">Click the microphone to start recording</p>
              )}
            </div>

            {/* Recording Instructions */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Recording Tips:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Use the target phrases naturally in your speech</li>
                <li>• {activity.recordingTime ? `Aim for ${activity.recordingTime} seconds` : 'Take your time to express your thoughts clearly'}</li>
                <li>• You can re-record if you're not satisfied</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Playback Section */}
        {hasRecorded && audioUrl && (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-4">Review Your Recording</h3>
            
            <div className="space-y-4">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlayingRecording(false)} />
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={playRecording}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  {isPlayingRecording ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlayingRecording ? 'Pause' : 'Play'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-purple-600">
                  Listen to your recording to check pronunciation and fluency
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={completeActivity}
            disabled={!hasRecorded}
            className="min-w-[120px]"
          >
            Complete Activity
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setTimeSpent(0)
              setShowResults(false)
              setIsCompleted(false)
              setRecordingTime(0)
              setHasRecorded(false)
              setAudioBlob(null)
              setAudioUrl(null)
              setIsPlayingRecording(false)
              if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {hasRecorded ? '✅ Recording completed! You can now complete the activity.' : '🎤 Record your speech to continue'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 