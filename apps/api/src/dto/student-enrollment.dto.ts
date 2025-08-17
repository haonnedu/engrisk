import { IsUUID, IsEnum, IsOptional, IsDateString, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { EnrollmentStatus } from '../entities/student-enrollment.entity'

export class CreateStudentEnrollmentDto {
  @ApiProperty({ description: 'ID của lớp học' })
  @IsUUID()
  classId!: string
}

export class UpdateStudentEnrollmentDto {
  @ApiProperty({ description: 'Trạng thái enrollment', enum: ['active', 'inactive', 'suspended'] })
  @IsIn(['active', 'inactive', 'suspended'])
  @IsOptional()
  status?: string

  @ApiProperty({ description: 'Ngày hoàn thành khóa học' })
  @IsDateString()
  @IsOptional()
  completedAt?: string
}

export class StudentEnrollmentResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  studentId!: string

  @ApiProperty()
  classId!: string

  @ApiProperty({ enum: ['active', 'inactive', 'suspended'] })
  status!: string

  @ApiProperty()
  enrolledAt!: Date

  @ApiProperty()
  completedAt?: Date

  @ApiProperty()
  totalPoints!: number

  @ApiProperty()
  completedActivities!: number

  @ApiProperty()
  averageScore!: number

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
} 