// Generated OpenAPI Types for Frontend
// This file is auto-generated from backend DTOs and entities

export interface User {
  id: string
  name: string
  phone: string
  role: 'student' | 'teacher' | 'admin'
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  name: string
  phone: string
  password: string
  role?: 'student' | 'teacher' | 'admin'
  avatar?: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  avatar?: string
  isActive?: boolean
}

export interface LoginRequest {
  phone: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: string
    name: string
    phone: string
    role: 'student' | 'teacher' | 'admin'
    avatar?: string
  }
}

export interface Class {
  id: string
  name: string
  description?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  maxStudents: number
  schedule?: string
  status: 'active' | 'inactive' | 'archived'
  teacherId: string
  createdAt: string
  updatedAt: string
}

export interface CreateClassRequest {
  name: string
  description?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  maxStudents?: number
  schedule?: string
  status?: 'active' | 'inactive' | 'archived'
}

export interface UpdateClassRequest {
  name?: string
  description?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  maxStudents?: number
  schedule?: string
  status?: 'active' | 'inactive' | 'archived'
}

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

export interface CreateLessonRequest {
  title: string
  description: string
  classId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  status?: 'draft' | 'published' | 'archived'
  objectives: string[]
  materials: string[]
}

export interface UpdateLessonRequest {
  title?: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  status?: 'draft' | 'published' | 'archived'
  objectives?: string[]
  materials?: string[]
}

export interface Activity {
  id: string
  type: 'quiz' | 'matching' | 'fill-blank' | 'listening' | 'speaking' | 'reading'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  isCompleted: boolean
  score?: number
  timeLimit?: number
  readingText?: string
  audioUrl?: string
  transcript?: string
  prompt?: string
  targetPhrases?: string[]
  recordingTime?: number
  createdAt: string
  updatedAt: string
}

export interface CreateActivityRequest {
  type: 'quiz' | 'matching' | 'fill-blank' | 'listening' | 'speaking' | 'reading'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  timeLimit?: number
  readingText?: string
  audioUrl?: string
  transcript?: string
  prompt?: string
  targetPhrases?: string[]
  recordingTime?: number
}

export interface UpdateActivityRequest {
  type?: 'quiz' | 'matching' | 'fill-blank' | 'listening' | 'speaking' | 'reading'
  title?: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number
  points?: number
  timeLimit?: number
  readingText?: string
  audioUrl?: string
  transcript?: string
  prompt?: string
  targetPhrases?: string[]
  recordingTime?: number
}

export interface QuizQuestion {
  id: string
  activityId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  createdAt: string
}

export interface CreateQuizQuestionRequest {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface MatchingPair {
  id: string
  activityId: string
  leftText: string
  rightText: string
  shuffle: boolean
  createdAt: string
}

export interface CreateMatchingPairRequest {
  leftText: string
  rightText: string
  shuffle?: boolean
}

export interface FillBlank {
  id: string
  activityId: string
  word: string
  hint?: string
  createdAt: string
}

export interface CreateFillBlankRequest {
  word: string
  hint?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Error types
export interface ApiError {
  message: string
  statusCode: number
  error: string
}

// Auth types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Common types
export type UserRole = 'student' | 'teacher' | 'admin'
export type ClassLevel = 'beginner' | 'intermediate' | 'advanced'
export type ClassStatus = 'active' | 'inactive' | 'archived'
export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type LessonStatus = 'draft' | 'published' | 'archived'
export type ActivityType = 'quiz' | 'matching' | 'fill-blank' | 'listening' | 'speaking' | 'reading'
export type ActivityDifficulty = 'beginner' | 'intermediate' | 'advanced'
