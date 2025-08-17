import { useState, useEffect, useCallback } from 'react'
import { StudentEnrollmentService } from '../services/student-enrollment.service'
import { LessonsService } from '../services/lessons.service'
import type { StudentEnrollment } from '../services/student-enrollment.service'
import type { Lesson } from '../services/lessons.service'

export interface StudentLesson extends Lesson {
  enrollment?: StudentEnrollment
  progress?: {
    completedActivities: number
    totalActivities: number
    averageScore: number
  }
}

export const useStudentLessons = (studentId?: string) => {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([])
  const [lessons, setLessons] = useState<StudentLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await StudentEnrollmentService.getMyEnrollments()
      setEnrollments(data)
      return data
    } catch (err) {
      setError('Failed to fetch enrollments')
      console.error('Error fetching enrollments:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLessonsForEnrollments = useCallback(async (enrollmentsData: StudentEnrollment[]) => {
    try {
      const allLessons: StudentLesson[] = []
      
      for (const enrollment of enrollmentsData) {
        if (enrollment.status === 'active') {
          try {
            const lessonsService = new LessonsService()
            const classLessons = await lessonsService.getLessonsByClass(enrollment.classId)
            const lessonsWithEnrollment = classLessons.map((lesson: Lesson) => ({
              ...lesson,
              enrollment,
              progress: {
                completedActivities: enrollment.completedActivities,
                totalActivities: 0, // Will be updated when activities are loaded
                averageScore: enrollment.averageScore
              }
            }))
            allLessons.push(...lessonsWithEnrollment)
          } catch (err) {
            console.error(`Error fetching lessons for class ${enrollment.classId}:`, err)
          }
        }
      }
      
      setLessons(allLessons)
      return allLessons
    } catch (err) {
      setError('Failed to fetch lessons')
      console.error('Error fetching lessons:', err)
      return []
    }
  }, [])

  const loadStudentLessons = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const enrollmentsData = await fetchEnrollments()
      if (enrollmentsData.length > 0) {
        await fetchLessonsForEnrollments(enrollmentsData)
      }
    } catch (err) {
      setError('Failed to load student lessons')
      console.error('Error loading student lessons:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchEnrollments, fetchLessonsForEnrollments])

  const enrollInClass = useCallback(async (classId: string) => {
    if (!studentId) {
      setError('Student ID is required')
      return null
    }

    try {
      const enrollment = await StudentEnrollmentService.enrollStudent({
        studentId,
        classId
      })
      
      // Refresh data after enrollment
      await loadStudentLessons()
      return enrollment
    } catch (err) {
      setError('Failed to enroll in class')
      console.error('Error enrolling in class:', err)
      return null
    }
  }, [studentId, loadStudentLessons])

  const unenrollFromClass = useCallback(async (classId: string) => {
    try {
      await StudentEnrollmentService.unenrollStudent(classId)
      
      // Refresh data after unenrollment
      await loadStudentLessons()
    } catch (err) {
      setError('Failed to unenroll from class')
      console.error('Error unenrolling from class:', err)
    }
  }, [loadStudentLessons])

  const getLessonProgress = useCallback((lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (!lesson) return null
    
    return {
      completedActivities: lesson.progress?.completedActivities || 0,
      totalActivities: lesson.progress?.totalActivities || 0,
      averageScore: lesson.progress?.averageScore || 0,
      completionPercentage: lesson.progress?.totalActivities 
        ? (lesson.progress.completedActivities / lesson.progress.totalActivities) * 100 
        : 0
    }
  }, [lessons])

  const getClassLessons = useCallback((classId: string) => {
    return lessons.filter(lesson => lesson.classId === classId)
  }, [lessons])

  const getEnrollmentByClass = useCallback((classId: string) => {
    return enrollments.find(enrollment => enrollment.classId === classId)
  }, [enrollments])

  useEffect(() => {
    if (studentId) {
      loadStudentLessons()
    }
  }, [studentId, loadStudentLessons])

  return {
    enrollments,
    lessons,
    loading,
    error,
    loadStudentLessons,
    enrollInClass,
    unenrollFromClass,
    getLessonProgress,
    getClassLessons,
    getEnrollmentByClass,
    refresh: loadStudentLessons
  }
} 