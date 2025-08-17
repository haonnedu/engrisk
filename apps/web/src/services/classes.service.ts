import { ApiService } from './api.service'

export interface Class {
  id: string
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  maxStudents: number
  schedule: string
  status: 'active' | 'inactive' | 'archived'
  teacherId: string
  createdAt: string
  updatedAt: string
}

export interface CreateClassDto {
  name: string
  description?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  maxStudents?: number
  schedule?: string
  teacherId: string
}

export interface UpdateClassDto {
  name?: string
  description?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  maxStudents?: number
  schedule?: string
  status?: 'active' | 'inactive' | 'archived'
}

export interface ClassListResponse {
  data: Class[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class ClassesService extends ApiService {
  private baseUrl = '/classes'

  async getClasses(page = 1, limit = 20): Promise<ClassListResponse> {
    return this.getInstance<ClassListResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }

  async getClassById(id: string): Promise<Class> {
    return this.getInstance<Class>(`${this.baseUrl}/${id}`)
  }

  async createClass(data: CreateClassDto): Promise<Class> {
    return this.postInstance<Class>(this.baseUrl, data)
  }

  async updateClass(id: string, data: UpdateClassDto): Promise<Class> {
    return this.putInstance<Class>(`${this.baseUrl}/${id}`, data)
  }

  async deleteClass(id: string): Promise<void> {
    return this.deleteInstance<void>(`${this.baseUrl}/${id}`)
  }

  async getClassStudents(classId: string): Promise<any[]> {
    return this.getInstance<any[]>(`${this.baseUrl}/${classId}/students`)
  }

  async addStudentToClass(classId: string, studentId: string): Promise<any> {
    return this.postInstance<any>(`${this.baseUrl}/${classId}/students`, { studentId })
  }

  async removeStudentFromClass(classId: string, studentId: string): Promise<any> {
    return this.deleteInstance<any>(`${this.baseUrl}/${classId}/students/${studentId}`)
  }

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    return this.getInstance<Class[]>(`${this.baseUrl}/teacher/${teacherId}`)
  }

  // Static methods for direct usage
  static async getClasses(page = 1, limit = 20): Promise<ClassListResponse> {
    return ApiService.get<ClassListResponse>(`/classes?page=${page}&limit=${limit}`)
  }

  static async getClassById(id: string): Promise<Class> {
    return ApiService.get<Class>(`/classes/${id}`)
  }

  static async createClass(data: CreateClassDto): Promise<Class> {
    return ApiService.post<Class>('/classes', data)
  }

  static async updateClass(id: string, data: UpdateClassDto): Promise<Class> {
    return ApiService.put<Class>(`/classes/${id}`, data)
  }

  static async deleteClass(id: string): Promise<void> {
    return ApiService.delete<void>(`/classes/${id}`)
  }
} 