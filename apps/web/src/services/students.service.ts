import { ApiService } from './api.service'

export interface Student {
  id: string
  name: string
  phone: string
  role: 'student'
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStudentDto {
  name: string
  phone: string
  password: string
  avatar?: string
}

export interface UpdateStudentDto {
  name?: string
  phone?: string
  avatar?: string
}

export interface StudentListResponse {
  data: Student[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface StudentProgress {
  studentId: string
  totalClasses: number
  completedLessons: number
  totalActivities: number
  completedActivities: number
  averageScore: number
}

export class StudentsService extends ApiService {
  private baseUrl = '/students'

  async getStudents(page = 1, limit = 20): Promise<StudentListResponse> {
    return this.getInstance<StudentListResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }

  async getStudentsList(): Promise<Student[]> {
    return this.getInstance<Student[]>(`${this.baseUrl}/list`)
  }

  async getStudentById(id: string): Promise<Student> {
    return this.getInstance<Student>(`${this.baseUrl}/${id}`)
  }

  async createStudent(data: CreateStudentDto): Promise<Student> {
    return this.postInstance<Student>(this.baseUrl, data)
  }

  async updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
    return this.putInstance<Student>(`${this.baseUrl}/${id}`, data)
  }

  async deleteStudent(id: string): Promise<void> {
    return this.deleteInstance<void>(`${this.baseUrl}/${id}`)
  }

  async getStudentClasses(studentId: string): Promise<any[]> {
    return this.getInstance<any[]>(`${this.baseUrl}/${studentId}/classes`)
  }

  async getStudentActivities(studentId: string): Promise<any[]> {
    return this.getInstance<any[]>(`${this.baseUrl}/${studentId}/activities`)
  }

  async getStudentProgress(studentId: string): Promise<StudentProgress> {
    return this.getInstance<StudentProgress>(`${this.baseUrl}/${studentId}/progress`)
  }

  async enrollStudentInClass(studentId: string, classId: string): Promise<any> {
    return this.postInstance<any>(`${this.baseUrl}/${studentId}/enroll/${classId}`)
  }

  async unenrollStudentFromClass(studentId: string, classId: string): Promise<any> {
    return this.deleteInstance<any>(`${this.baseUrl}/${studentId}/unenroll/${classId}`)
  }

  // Static methods for direct usage
  static async getStudents(page = 1, limit = 20): Promise<StudentListResponse> {
    return ApiService.get<StudentListResponse>(`/students?page=${page}&limit=${limit}`)
  }

  static async getStudentById(id: string): Promise<Student> {
    return ApiService.get<Student>(`/students/${id}`)
  }

  static async createStudent(data: CreateStudentDto): Promise<Student> {
    return ApiService.post<Student>('/students', data)
  }

  static async updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
    return ApiService.put<Student>(`/students/${id}`, data)
  }

  static async deleteStudent(id: string): Promise<void> {
    return ApiService.delete<void>(`/students/${id}`)
  }
} 