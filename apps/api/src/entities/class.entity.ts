import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { User } from './user.entity'
import { Lesson } from './lesson.entity'

export enum ClassLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum ClassStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({ 
    type: 'enum', 
    enum: ClassLevel, 
    default: ClassLevel.BEGINNER,
    nullable: false 
  })
  level!: ClassLevel

  @Column({ type: 'int', default: 20, nullable: false })
  maxStudents!: number

  @Column({ type: 'varchar', length: 500, nullable: true })
  schedule!: string

  @Column({ 
    type: 'enum', 
    enum: ClassStatus, 
    default: ClassStatus.ACTIVE,
    nullable: false 
  })
  status!: ClassStatus

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.teachingClasses)
  teacher!: User

  @Column({ type: 'uuid', nullable: false })
  teacherId!: string

  @ManyToMany(() => User, (user) => user.enrolledClasses)
  students!: User[]

  @OneToMany(() => Lesson, (lesson) => lesson.class)
  lessons!: Lesson[]
} 