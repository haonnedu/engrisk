import { ApiService } from './api.service'

export interface Activity {
  id: string
  type: 'quiz' | 'matching' | 'fill-blank' | 'reading' | 'speaking' | 'listening'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  timeLimit?: number
  isCompleted?: boolean
  score?: number
  readingText?: string
  audioUrl?: string
  transcript?: string
  prompt?: string
  targetPhrases?: string[]
  recordingTime?: number
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface MatchingPair {
  id: string
  leftText: string
  rightText: string
  shuffle: boolean
}

export interface FillBlank {
  id: string
  word: string
  hint?: string
}

export interface CreateActivityDto {
  type: 'quiz' | 'matching' | 'fill-blank' | 'reading' | 'speaking' | 'listening'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  timeLimit?: number
  quizQuestions?: QuizQuestion[]
  matchingPairs?: MatchingPair[]
  fillBlanks?: FillBlank[]
  readingText?: string
  audioUrl?: string
  transcript?: string
  prompt?: string
  targetPhrases?: string[]
  recordingTime?: number
}

export interface UpdateActivityDto {
  title?: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number
  points?: number
  timeLimit?: number
}

export class ActivitiesService extends ApiService {
  private baseUrl = '/activities'

  async getActivities(): Promise<Activity[]> {
    return this.getInstance<Activity[]>(this.baseUrl)
  }

  async getActivityById(id: string): Promise<Activity> {
    return this.getInstance<Activity>(`${this.baseUrl}/${id}`)
  }

  async createActivity(data: CreateActivityDto): Promise<Activity> {
    return this.postInstance<Activity>(this.baseUrl, data)
  }

  async updateActivity(id: string, data: UpdateActivityDto): Promise<Activity> {
    return this.putInstance<Activity>(`${this.baseUrl}/${id}`, data)
  }

  async deleteActivity(id: string): Promise<void> {
    return this.deleteInstance<void>(`${this.baseUrl}/${id}`)
  }

  async getActivitiesByLesson(lessonId: string): Promise<Activity[]> {
    return this.getInstance<Activity[]>(`${this.baseUrl}/lesson/${lessonId}`)
  }

  async getActivitiesByType(type: string): Promise<Activity[]> {
    return this.getInstance<Activity[]>(`${this.baseUrl}/type/${type}`)
  }

  async getActivitiesByDifficulty(difficulty: string): Promise<Activity[]> {
    return this.getInstance<Activity[]>(`${this.baseUrl}/difficulty/${difficulty}`)
  }

  async markActivityAsCompleted(id: string, score: number): Promise<Activity> {
    return this.postInstance<Activity>(`${this.baseUrl}/${id}/complete`, { score })
  }

  async getQuizQuestions(activityId: string): Promise<QuizQuestion[]> {
    return this.getInstance<QuizQuestion[]>(`${this.baseUrl}/quiz/questions/${activityId}`)
  }

  async getMatchingPairs(activityId: string): Promise<MatchingPair[]> {
    return this.getInstance<MatchingPair[]>(`${this.baseUrl}/matching/pairs/${activityId}`)
  }

  async getFillBlanks(activityId: string): Promise<FillBlank[]> {
    return this.getInstance<FillBlank[]>(`${this.baseUrl}/fill-blanks/${activityId}`)
  }

  // Static methods for direct usage
  static async getActivities(): Promise<Activity[]> {
    return ApiService.get<Activity[]>('/activities')
  }

  static async getActivityById(id: string): Promise<Activity> {
    return ApiService.get<Activity>(`/activities/${id}`)
  }

  static async createActivity(data: CreateActivityDto): Promise<Activity> {
    return ApiService.post<Activity>('/activities', data)
  }

  static async updateActivity(id: string, data: UpdateActivityDto): Promise<Activity> {
    return ApiService.put<Activity>(`/activities/${id}`, data)
  }

  static async deleteActivity(id: string): Promise<void> {
    return ApiService.delete<void>(`/activities/${id}`)
  }
} 