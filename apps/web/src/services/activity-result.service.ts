import { ApiService } from './api.service'

export interface ActivityResult {
  id: string
  studentId: string
  activityId: string
  status: 'in_progress' | 'completed' | 'abandoned'
  score?: number
  maxScore?: number
  percentage?: number
  timeSpent?: number
  timeLimit?: number
  answers?: Record<string, any>
  correctAnswers?: Record<string, any>
  feedback?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  activity?: {
    id: string
    title: string
    type: string
    description: string
  }
}

export interface StartActivityDto {
  studentId: string
  activityId: string
}

export interface SubmitActivityDto {
  studentId: string
  activityId: string
  timeSpent: number
  answers: Record<string, any>
  score: number
  maxScore: number
  percentage: number
}

export interface UpdateActivityResultDto {
  status?: 'in_progress' | 'completed' | 'abandoned'
  score?: number
  timeSpent?: number
  answers?: Record<string, any>
  feedback?: string
}

export interface StudentProgress {
  totalActivities: number
  completedActivities: number
  abandonedActivities: number
  totalScore: number
  averageScore: number
  totalTimeSpent: number
}

export class ActivityResultService extends ApiService {
  private baseUrl = '/activity-results'

  async startActivity(data: StartActivityDto): Promise<ActivityResult> {
    return this.postInstance<ActivityResult>(`${this.baseUrl}/start`, data)
  }

  async submitActivity(data: SubmitActivityDto): Promise<ActivityResult> {
    return this.postInstance<ActivityResult>(`${this.baseUrl}/submit`, data)
  }

  async getActivityResult(studentId: string, activityId: string): Promise<ActivityResult> {
    return this.getInstance<ActivityResult>(`${this.baseUrl}/activity/${activityId}`)
  }

  async getStudentActivityResults(studentId: string): Promise<ActivityResult[]> {
    return this.getInstance<ActivityResult[]>(`${this.baseUrl}/student/${studentId}`)
  }

  async getMyResults(): Promise<ActivityResult[]> {
    return this.getInstance<ActivityResult[]>(`${this.baseUrl}/my-results`)
  }

  async getClassActivityResults(classId: string): Promise<ActivityResult[]> {
    return this.getInstance<ActivityResult[]>(`${this.baseUrl}/class/${classId}`)
  }

  async updateActivityResult(activityId: string, data: UpdateActivityResultDto): Promise<ActivityResult> {
    return this.putInstance<ActivityResult>(`${this.baseUrl}/${activityId}`, data)
  }

  async abandonActivity(activityId: string): Promise<ActivityResult> {
    return this.postInstance<ActivityResult>(`${this.baseUrl}/abandon/${activityId}`)
  }

  async getStudentProgress(studentId: string): Promise<StudentProgress> {
    return this.getInstance<StudentProgress>(`${this.baseUrl}/progress/${studentId}`)
  }

  async getMyProgress(): Promise<StudentProgress> {
    return this.getInstance<StudentProgress>(`${this.baseUrl}/my-progress`)
  }

  // Static methods for direct usage
  static async startActivity(data: StartActivityDto): Promise<ActivityResult> {
    return ApiService.post<ActivityResult>('/activity-results/start', data)
  }

  static async submitActivity(data: SubmitActivityDto): Promise<ActivityResult> {
    return ApiService.post<ActivityResult>('/activity-results/submit', data)
  }

  static async getMyResults(): Promise<ActivityResult[]> {
    return ApiService.get<ActivityResult[]>('/activity-results/my-results')
  }

  static async getMyProgress(): Promise<StudentProgress> {
    return ApiService.get<StudentProgress>('/activity-results/my-progress')
  }

  static async abandonActivity(activityId: string): Promise<ActivityResult> {
    return ApiService.post<ActivityResult>(`/activity-results/abandon/${activityId}`)
  }
} 