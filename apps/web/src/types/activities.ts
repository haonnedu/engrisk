export type ActivityType = 'quiz' | 'matching' | 'fill-blank' | 'listening' | 'speaking' | 'reading'

export interface BaseActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // minutes
  points: number
  isCompleted?: boolean
  score?: number
  timeLimit?: number // minutes
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

export interface QuizActivity extends BaseActivity {
  type: 'quiz'
  quizQuestions: QuizQuestion[]
  timeLimit?: number // minutes
}

export interface MatchingPair {
  id: string
  leftText: string
  rightText: string
  shuffle: boolean
}

export interface MatchingActivity extends BaseActivity {
  type: 'matching'
  matchingPairs: MatchingPair[]
}

export interface FillBlank {
  id: string
  word: string
  hint?: string
}

export interface FillBlankActivity extends BaseActivity {
  type: 'fill-blank'
  fillBlanks: FillBlank[]
  readingText?: string // Optional text to display with blanks
}

export interface ListeningActivity extends BaseActivity {
  type: 'listening'
  audioUrl: string
  transcript?: string
  comprehensionQuestions?: QuizQuestion[] // Optional questions after listening
}

export interface SpeakingActivity extends BaseActivity {
  type: 'speaking'
  prompt: string
  targetPhrases?: string[]
  recordingTime?: number // seconds
}

export interface ReadingActivity extends BaseActivity {
  type: 'reading'
  readingText: string
  comprehensionQuestions?: QuizQuestion[] // Optional questions after reading
  vocabulary?: {
    word: string
    definition: string
    example: string
  }[]
}

export type Activity = QuizActivity | MatchingActivity | FillBlankActivity | ListeningActivity | SpeakingActivity | ReadingActivity

// Helper types for form creation
export interface CreateQuizActivity {
  type: 'quiz'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  timeLimit?: number
  quizQuestions: {
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
}

export interface CreateMatchingActivity {
  type: 'matching'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  matchingPairs: {
    left: string
    right: string
    shuffle: boolean
  }[]
}

export interface CreateFillBlankActivity {
  type: 'fill-blank'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  readingText?: string
  fillBlanks: {
    word: string
    hint?: string
  }[]
}

export interface CreateListeningActivity {
  type: 'listening'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  timeLimit?: number
  audioUrl: string
  transcript?: string
  comprehensionQuestions?: {
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
}

export interface CreateSpeakingActivity {
  type: 'speaking'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  prompt: string
  targetPhrases?: string[]
  recordingTime?: number
}

export interface CreateReadingActivity {
  type: 'reading'
  title: string
  description: string
  lessonId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  points: number
  timeLimit?: number
  readingText: string
  comprehensionQuestions?: {
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
  vocabulary?: {
    word: string
    definition: string
    example: string
  }[]
}

export type CreateActivityData = 
  | CreateQuizActivity 
  | CreateMatchingActivity 
  | CreateFillBlankActivity 
  | CreateListeningActivity 
  | CreateSpeakingActivity 
  | CreateReadingActivity