import { ApiService } from './api.service'

export interface Lesson {
  id: string
  title: string
  description: string
  classId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  status: 'draft' | 'published' | 'archived'
  objectives: string[]
  materials: string[]
  teacherId: string
  createdAt: string
  updatedAt: string
}

export interface CreateLessonDto {
  classId: string
  title: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  objectives?: string[]
  materials?: string[]
  teacherId: string
}

export interface UpdateLessonDto {
  title?: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  status?: 'draft' | 'published' | 'archived'
  objectives?: string[]
  materials?: string[]
}

export interface LessonListResponse {
  data: Lesson[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class LessonsService extends ApiService {
  private baseUrl = '/lessons'

  async getLessons(page = 1, limit = 20): Promise<LessonListResponse> {
    return this.getInstance<LessonListResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }

  async getLessonById(id: string): Promise<Lesson> {
    return this.getInstance<Lesson>(`${this.baseUrl}/${id}`)
  }

  async createLesson(data: CreateLessonDto): Promise<Lesson> {
    return this.postInstance<Lesson>(this.baseUrl, data)
  }

  async updateLesson(id: string, data: UpdateLessonDto): Promise<Lesson> {
    return this.putInstance<Lesson>(`${this.baseUrl}/${id}`, data)
  }

  async deleteLesson(id: string): Promise<void> {
    return this.deleteInstance<void>(`${this.baseUrl}/${id}`)
  }

  async getLessonsByClass(classId: string): Promise<Lesson[]> {
    return this.getInstance<Lesson[]>(`${this.baseUrl}/class/${classId}`)
  }

  async getLessonsByTeacher(teacherId: string): Promise<Lesson[]> {
    return this.getInstance<Lesson[]>(`${this.baseUrl}/teacher/${teacherId}`)
  }

  async publishLesson(id: string): Promise<Lesson> {
    return this.postInstance<Lesson>(`${this.baseUrl}/${id}/publish`)
  }

  async unpublishLesson(id: string): Promise<Lesson> {
    return this.postInstance<Lesson>(`${this.baseUrl}/${id}/unpublish`)
  }

  // Static methods for direct usage
  static async getLessons(page = 1, limit = 20): Promise<LessonListResponse> {
    return ApiService.get<LessonListResponse>(`/lessons?page=${page}&limit=${limit}`)
  }

  static async getLessonById(id: string): Promise<Lesson> {
    return ApiService.get<Lesson>(`/lessons/${id}`)
  }

  static async createLesson(data: CreateLessonDto): Promise<Lesson> {
    return ApiService.post<Lesson>('/lessons', data)
  }

  static async updateLesson(id: string, data: UpdateLessonDto): Promise<Lesson> {
    return ApiService.put<Lesson>(`/lessons/${id}`, data)
  }

  static async deleteLesson(id: string): Promise<void> {
    return ApiService.delete<void>(`/lessons/${id}`)
  }
} 