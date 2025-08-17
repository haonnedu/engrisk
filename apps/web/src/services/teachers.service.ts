import { ApiService } from './api.service'

export interface Teacher {
  id: string
  name: string
  phone: string
  role: 'teacher'
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface CreateTeacherDto {
  name: string
  phone: string
  password: string
  avatar?: string
}

export interface UpdateTeacherDto {
  name?: string
  phone?: string
  avatar?: string
}

export interface TeacherListResponse {
  data: Teacher[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TeacherStatistics {
  teacherId: string
  totalClasses: number
  totalStudents: number
  totalLessons: number
  totalActivities: number
  averageStudentScore: number
}

export class TeachersService extends ApiService {
  private baseUrl = '/teachers'

  async getTeachers(page = 1, limit = 20): Promise<TeacherListResponse> {
    return this.getInstance<TeacherListResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }

  async getTeachersList(): Promise<Teacher[]> {
    return this.getInstance<Teacher[]>(`${this.baseUrl}/list`)
  }

  async getTeacherById(id: string): Promise<Teacher> {
    return this.getInstance<Teacher>(`${this.baseUrl}/${id}`)
  }

  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    return this.postInstance<Teacher>(this.baseUrl, data)
  }

  async updateTeacher(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    return this.putInstance<Teacher>(`${this.baseUrl}/${id}`, data)
  }

  async deleteTeacher(id: string): Promise<void> {
    return this.deleteInstance<void>(`${this.baseUrl}/${id}`)
  }

  async getTeacherClasses(teacherId: string): Promise<any[]> {
    return this.getInstance<any[]>(`${this.baseUrl}/${teacherId}/classes`)
  }

  async getTeacherLessons(teacherId: string): Promise<any[]> {
    return this.getInstance<any[]>(`${this.baseUrl}/${teacherId}/lessons`)
  }

  async getTeacherStatistics(teacherId: string): Promise<TeacherStatistics> {
    return this.getInstance<TeacherStatistics>(`${this.baseUrl}/${teacherId}/statistics`)
  }

  // Static methods for direct usage
  static async getTeachers(page = 1, limit = 20): Promise<TeacherListResponse> {
    return ApiService.get<TeacherListResponse>(`/teachers?page=${page}&limit=${limit}`)
  }

  static async getTeacherById(id: string): Promise<Teacher> {
    return ApiService.get<Teacher>(`/teachers/${id}`)
  }

  static async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    return ApiService.post<Teacher>('/teachers', data)
  }

  static async updateTeacher(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    return ApiService.put<Teacher>(`/teachers/${id}`, data)
  }

  static async deleteTeacher(id: string): Promise<void> {
    return ApiService.delete<void>(`/teachers/${id}`)
  }
} 