import { useState, useEffect, useCallback } from 'react'
import { StudentEnrollmentService } from '../services/student-enrollment.service'
import type { 
  LearningDashboard, 
  ClassLesson, 
  LessonActivity, 
  ActivityDetail, 
  StudentProgress 
} from '../services/student-enrollment.service'

export const useStudentLearning = (studentId?: string) => {
  const [learningDashboard, setLearningDashboard] = useState<LearningDashboard | null>(null)
  const [selectedClassLessons, setSelectedClassLessons] = useState<ClassLesson[]>([])
  const [selectedLessonActivities, setSelectedLessonActivities] = useState<LessonActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null)
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load learning dashboard
  const loadLearningDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const dashboard = await StudentEnrollmentService.getLearningDashboard()
      setLearningDashboard(dashboard)
      return dashboard
    } catch (err) {
      setError('Failed to load learning dashboard')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Load class lessons for a specific class
  const loadClassLessons = useCallback(async (classId: string) => {
    try {
      setError(null)
      const lessons = await StudentEnrollmentService.getClassLessonsForStudent(classId)
      setSelectedClassLessons(lessons)
      return lessons
    } catch (err) {
      setError('Failed to load class lessons')
      return []
    }
  }, [])

  // Load lesson activities for a specific lesson
  const loadLessonActivities = useCallback(async (lessonId: string) => {
    try {
      setError(null)
      const activities = await StudentEnrollmentService.getLessonActivitiesForStudent(lessonId)
      setSelectedLessonActivities(activities)
      return activities
    } catch (err) {
      setError('Failed to load lesson activities')
      return []
    }
  }, [])

  // Load activity detail
  const loadActivityDetail = useCallback(async (activityId: string) => {
    try {
      setError(null)
      const activity = await StudentEnrollmentService.getActivityForStudent(activityId)
      setSelectedActivity(activity)
      return activity
    } catch (err) {
      setError('Failed to load activity detail')
      return null
    }
  }, [])

  // Load student progress
  const loadStudentProgress = useCallback(async () => {
    try {
      setError(null)
      const progress = await StudentEnrollmentService.getStudentProgress()
      setStudentProgress(progress)
      return progress
    } catch (err) {
      setError('Failed to load student progress')
      return null
    }
  }, [])

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await Promise.all([
        loadLearningDashboard(),
        loadStudentProgress()
      ])
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [loadLearningDashboard, loadStudentProgress])

  // Refresh data
  const refresh = useCallback(async () => {
    await loadAllData()
  }, [loadAllData])

  // Clear selections
  const clearSelections = useCallback(() => {
    setSelectedClassLessons([])
    setSelectedLessonActivities([])
    setSelectedActivity(null)
  }, [])

  // Select class to view lessons
  const selectClass = useCallback(async (classId: string) => {
    clearSelections()
    await loadClassLessons(classId)
  }, [clearSelections, loadClassLessons])

  // Select lesson to view activities
  const selectLesson = useCallback(async (lessonId: string) => {
    setSelectedLessonActivities([])
    setSelectedActivity(null)
    await loadLessonActivities(lessonId)
  }, [loadLessonActivities])

  // Select activity to view detail
  const selectActivity = useCallback(async (activityId: string) => {
    await loadActivityDetail(activityId)
  }, [loadActivityDetail])

  // Go back to lessons view
  const goBackToLessons = useCallback(() => {
    setSelectedLessonActivities([])
    setSelectedActivity(null)
  }, [])

  // Go back to classes view
  const goBackToClasses = useCallback(() => {
    clearSelections()
  }, [clearSelections])

  useEffect(() => {
    if (studentId) {
      loadAllData()
    }
  }, [studentId, loadAllData])

  return {
    // Data
    learningDashboard,
    selectedClassLessons,
    selectedLessonActivities,
    selectedActivity,
    studentProgress,
    
    // State
    loading,
    error,
    
    // Actions
    loadLearningDashboard,
    loadClassLessons,
    loadLessonActivities,
    loadActivityDetail,
    loadStudentProgress,
    loadAllData,
    refresh,
    
    // Navigation
    selectClass,
    selectLesson,
    selectActivity,
    goBackToLessons,
    goBackToClasses,
    clearSelections
  }
}
