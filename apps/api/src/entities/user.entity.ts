import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { Class } from './class.entity'
import { Lesson } from './lesson.entity'

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  phone!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.STUDENT,
    nullable: false 
  })
  role!: UserRole

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar!: string

  @Column({ type: 'boolean', default: true, nullable: false })
  isActive!: boolean

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  // Relationships
  @ManyToMany(() => Class, (classItem) => classItem.students)
  @JoinTable({
    name: 'class_students',
    joinColumn: { name: 'studentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'classId', referencedColumnName: 'id' }
  })
  enrolledClasses!: Class[]

  @OneToMany(() => Class, (classItem) => classItem.teacher)
  teachingClasses!: Class[]

  @OneToMany(() => Lesson, (lesson) => lesson.teacher)
  createdLessons!: Lesson[]
} 