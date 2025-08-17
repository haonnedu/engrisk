export interface Lesson {
  id: string
  title: string
  description: string
  classId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  status: 'draft' | 'published' | 'archived'
  objectives: string[]
  materials: string[]
  activities: string[] // Array of activity IDs
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface LessonsResponse extends PaginatedResponse<Lesson> {} 