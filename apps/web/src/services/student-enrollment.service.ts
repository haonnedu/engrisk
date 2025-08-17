import { ApiService } from './api.service'

export interface StudentEnrollment {
  id: string
  studentId: string
  classId: string
  status: 'active' | 'inactive' | 'suspended'
  enrolledAt: string
  completedAt?: string
  totalPoints: number
  completedActivities: number
  averageScore: number
  createdAt: string
  updatedAt: string
  class?: {
    id: string
    name: string
    description: string
    level: string
    status: string
  }
}

export interface CreateStudentEnrollmentDto {
  classId: string
}

export interface UpdateStudentEnrollmentDto {
  status?: 'active' | 'inactive' | 'suspended'
  completedAt?: string
}

export interface EnrollmentStats {
  totalClasses: number
  activeClasses: number
  totalPoints: number
  averageScore: number
  completedActivities: number
}

// New interfaces for learning dashboard
export interface LearningDashboard {
  studentId: string
  totalClasses: number
  classes: ClassSummary[]
}

export interface ClassSummary {
  classId: string
  className: string
  classDescription: string
  classLevel: string
  enrolledAt: string
  totalPoints: number
  completedActivities: number
  averageScore: number
  lessonCount: number
}

export interface ClassLesson {
  id: string
  title: string
  description: string
  order: number
  createdAt: string
  activityCount: number
}

export interface LessonActivity {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  estimatedTime: number
  points: number
  createdAt: string
}

export interface ActivityDetail {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  estimatedTime: number
  points: number
  timeLimit?: number
  readingText?: string
  audioUrl?: string
  transcript?: string
  prompt?: string
  targetPhrases?: string[]
  recordingTime?: number
  createdAt: string
  lesson: {
    lessonId: string
    lessonTitle: string
    classId: string
    className: string
  }
}

export interface StudentProgress {
  studentId: string
  totalClasses: number
  totalPoints: number
  totalCompletedActivities: number
  averageScore: number
  classProgress: ClassProgress[]
}

export interface ClassProgress {
  classId: string
  className: string
  totalActivities: number
  completedActivities: number
  completionRate: number
  totalPoints: number
  averageScore: number
}

export class StudentEnrollmentService extends ApiService {
  private baseUrl = '/student-enrollments'

  async enrollStudent(data: CreateStudentEnrollmentDto): Promise<StudentEnrollment> {
    return this.postInstance<StudentEnrollment>(this.baseUrl, data)
  }

  async unenrollStudent(classId: string): Promise<void> {
    return this.deleteInstance<void>(`${this.baseUrl}/${classId}`)
  }

  async getStudentEnrollments(studentId: string): Promise<StudentEnrollment[]> {
    return this.getInstance<StudentEnrollment[]>(`${this.baseUrl}/student/${studentId}`)
  }

  async getMyEnrollments(): Promise<StudentEnrollment[]> {
    return this.getInstance<StudentEnrollment[]>(`${this.baseUrl}/my-enrollments`)
  }

  async getClassEnrollments(classId: string): Promise<StudentEnrollment[]> {
    return this.getInstance<StudentEnrollment[]>(`${this.baseUrl}/class/${classId}`)
  }

  async updateEnrollment(classId: string, data: UpdateStudentEnrollmentDto): Promise<StudentEnrollment> {
    return this.putInstance<StudentEnrollment>(`${this.baseUrl}/${classId}`, data)
  }

  async getEnrollmentStats(studentId: string): Promise<EnrollmentStats> {
    return this.getInstance<EnrollmentStats>(`${this.baseUrl}/stats/${studentId}`)
  }

  async getMyStats(): Promise<EnrollmentStats> {
    return this.getInstance<EnrollmentStats>(`${this.baseUrl}/my-stats`)
  }

  // === NEW METHODS FOR LEARNING DASHBOARD ===

  async getLearningDashboard(): Promise<LearningDashboard> {
    return this.getInstance<LearningDashboard>(`${this.baseUrl}/my-learning-dashboard`)
  }

  async getClassLessonsForStudent(classId: string): Promise<ClassLesson[]> {
    return this.getInstance<ClassLesson[]>(`${this.baseUrl}/my-classes/${classId}/lessons`)
  }

  async getLessonActivitiesForStudent(lessonId: string): Promise<LessonActivity[]> {
    return this.getInstance<LessonActivity[]>(`${this.baseUrl}/my-lessons/${lessonId}/activities`)
  }

  async getActivityForStudent(activityId: string): Promise<ActivityDetail> {
    return this.getInstance<ActivityDetail>(`${this.baseUrl}/my-activities/${activityId}`)
  }

  async getStudentProgress(): Promise<StudentProgress> {
    return this.getInstance<StudentProgress>(`${this.baseUrl}/my-progress`)
  }

  // Static methods for direct usage
  static async enrollStudent(data: CreateStudentEnrollmentDto): Promise<StudentEnrollment> {
    return ApiService.post<StudentEnrollment>('/student-enrollments', data)
  }

  static async unenrollStudent(classId: string): Promise<void> {
    return ApiService.delete<void>(`/student-enrollments/${classId}`)
  }

  static async getMyEnrollments(): Promise<StudentEnrollment[]> {
    return ApiService.get<StudentEnrollment[]>('/student-enrollments/my-enrollments')
  }

  static async getMyStats(): Promise<EnrollmentStats> {
    return ApiService.get<EnrollmentStats>('/student-enrollments/my-stats')
  }

  // New static methods
  static async getLearningDashboard(): Promise<LearningDashboard> {
    return ApiService.get<LearningDashboard>('/student-enrollments/my-learning-dashboard')
  }

  static async getClassLessonsForStudent(classId: string): Promise<ClassLesson[]> {
    return ApiService.get<ClassLesson[]>(`/student-enrollments/my-classes/${classId}/lessons`)
  }

  static async getLessonActivitiesForStudent(lessonId: string): Promise<LessonActivity[]> {
    return ApiService.get<LessonActivity[]>(`/student-enrollments/my-lessons/${lessonId}/activities`)
  }

  static async getActivityForStudent(activityId: string): Promise<ActivityDetail> {
    return ApiService.get<ActivityDetail>(`/student-enrollments/my-activities/${activityId}`)
  }

  static async getStudentProgress(): Promise<StudentProgress> {
    return ApiService.get<StudentProgress>('/student-enrollments/my-progress')
  }
} 