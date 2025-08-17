import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'
import { Activity } from './activity.entity'

export enum ActivityResultStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

@Entity('activity_results')
export class ActivityResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', nullable: false })
  studentId!: string

  @Column({ type: 'uuid', nullable: false })
  activityId!: string

  @Column({
    type: 'varchar',
    length: 20,
    default: ActivityResultStatus.IN_PROGRESS,
    nullable: false
  })
  status!: string

  @Column({ type: 'int', nullable: true })
  score?: number

  @Column({ type: 'int', nullable: true })
  maxScore?: number

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage?: number

  @Column({ type: 'int', nullable: true })
  timeSpent?: number // seconds

  @Column({ type: 'int', nullable: true })
  timeLimit?: number // seconds

  @Column({ type: 'jsonb', nullable: true })
  answers?: Record<string, any> // Store student answers

  @Column({ type: 'jsonb', nullable: true })
  correctAnswers?: Record<string, any> // Store correct answers for comparison

  @Column({ type: 'text', nullable: true })
  feedback?: string

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'studentId' })
  student!: User

  @ManyToOne(() => Activity, (activity) => activity.id)
  @JoinColumn({ name: 'activityId' })
  activity!: Activity
} 