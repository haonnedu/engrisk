import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { Lesson } from './lesson.entity'
import { QuizQuestion } from './quiz-question.entity'
import { MatchingPair } from './matching-pair.entity'
import { FillBlank } from './fill-blank.entity'

export enum ActivityType {
  QUIZ = 'quiz',
  MATCHING = 'matching',
  FILL_BLANK = 'fill-blank',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading'
}

export enum ActivityDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({
    type: 'enum',
    enum: ActivityType,
    nullable: false
  })
  type!: ActivityType

  @Column({ type: 'varchar', length: 255, nullable: false })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({
    type: 'enum',
    enum: ActivityDifficulty,
    default: ActivityDifficulty.BEGINNER,
    nullable: false
  })
  difficulty!: ActivityDifficulty

  @Column({ type: 'int', default: 15, nullable: false })
  estimatedTime!: number // minutes

  @Column({ type: 'int', default: 10, nullable: false })
  points!: number

  @Column({ type: 'boolean', default: false, nullable: false })
  isCompleted!: boolean

  @Column({ type: 'int', nullable: true })
  score?: number

  @Column({ type: 'int', nullable: true })
  timeLimit?: number // minutes

  @Column({ type: 'text', nullable: true })
  readingText?: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  audioUrl?: string

  @Column({ type: 'text', nullable: true })
  transcript?: string

  @Column({ type: 'text', nullable: true })
  prompt?: string

  @Column({ type: 'text', array: true, nullable: true })
  targetPhrases?: string[]

  @Column({ type: 'int', nullable: true })
  recordingTime?: number // seconds

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  // Relationships
  @ManyToOne(() => Lesson, (lesson) => lesson.activities)
  lesson!: Lesson

  @Column({ type: 'uuid', nullable: false })
  lessonId!: string

  // One-to-many relationships for different activity types
  @OneToMany(() => QuizQuestion, (question) => question.activity, { cascade: true })
  quizQuestions?: QuizQuestion[]

  @OneToMany(() => MatchingPair, (pair) => pair.activity, { cascade: true })
  matchingPairs?: MatchingPair[]

  @OneToMany(() => FillBlank, (blank) => blank.activity, { cascade: true })
  fillBlanks?: FillBlank[]
} 