import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Activity } from './activity.entity'

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text', nullable: false })
  question!: string

  @Column({ type: 'text', array: true, nullable: false })
  options!: string[]

  @Column({ type: 'int', nullable: false })
  correctAnswer!: number

  @Column({ type: 'text', nullable: true })
  explanation?: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  // Relationships
  @ManyToOne(() => Activity, (activity) => activity.quizQuestions)
  @JoinColumn({ name: 'activityId' })
  activity!: Activity

  @Column({ type: 'uuid', nullable: false })
  activityId!: string
} 