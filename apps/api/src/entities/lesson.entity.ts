import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from './user.entity'
import { Class } from './class.entity'
import { Activity } from './activity.entity'

export enum LessonDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum LessonStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({ 
    type: 'enum', 
    enum: LessonDifficulty, 
    default: LessonDifficulty.BEGINNER,
    nullable: false 
  })
  difficulty!: LessonDifficulty

  @Column({ type: 'int', default: 60, nullable: false })
  duration!: number // minutes

  @Column({ 
    type: 'enum', 
    enum: LessonStatus, 
    default: LessonStatus.DRAFT,
    nullable: false 
  })
  status!: LessonStatus

  @Column({ type: 'text', array: true, nullable: true })
  objectives!: string[]

  @Column({ type: 'text', array: true, nullable: true })
  materials!: string[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  // Relationships
  @ManyToOne(() => Class, (classItem) => classItem.lessons)
  class!: Class

  @Column({ type: 'uuid', nullable: false })
  classId!: string

  @ManyToOne(() => User, (user) => user.createdLessons)
  teacher!: User

  @Column({ type: 'uuid', nullable: false })
  teacherId!: string

  @OneToMany(() => Activity, (activity) => activity.lesson)
  activities!: Activity[]
} 