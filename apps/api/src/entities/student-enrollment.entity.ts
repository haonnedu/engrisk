import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'
import { Class } from './class.entity'

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity('student_enrollments')
export class StudentEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', nullable: false })
  studentId!: string

  @Column({ type: 'uuid', nullable: false })
  classId!: string

  @Column({
    type: 'varchar',
    length: 20,
    default: EnrollmentStatus.ACTIVE,
    nullable: false
  })
  status!: string

  @Column({ type: 'timestamp', nullable: true })
  enrolledAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @Column({ type: 'int', default: 0, nullable: false })
  totalPoints!: number

  @Column({ type: 'int', default: 0, nullable: false })
  completedActivities!: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: false })
  averageScore!: number

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: 'studentId' })
  student!: User

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'classId' })
  class!: Class
} 