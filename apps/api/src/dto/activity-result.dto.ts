import { IsUUID, IsEnum, IsOptional, IsNumber, IsString, IsObject, Min, Max, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ActivityResultStatus } from '../entities/activity-result.entity'

export class StartActivityDto {
  @ApiProperty({ description: 'ID của student' })
  @IsUUID()
  studentId!: string

  @ApiProperty({ description: 'ID của activity' })
  @IsUUID()
  activityId!: string
}

export class SubmitActivityDto {
  @ApiProperty({ description: 'ID của student' })
  @IsUUID()
  studentId!: string

  @ApiProperty({ description: 'ID của activity' })
  @IsUUID()
  activityId!: string

  @ApiProperty({ description: 'Thời gian làm bài (giây)' })
  @IsNumber()
  @Min(0)
  timeSpent!: number

  @ApiProperty({ description: 'Câu trả lời của student' })
  @IsObject()
  answers!: Record<string, any>

  @ApiProperty({ description: 'Điểm số đạt được' })
  @IsNumber()
  @Min(0)
  score!: number

  @ApiProperty({ description: 'Điểm số tối đa' })
  @IsNumber()
  @Min(0)
  maxScore!: number

  @ApiProperty({ description: 'Phần trăm hoàn thành' })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage!: number
}

export class UpdateActivityResultDto {
  @ApiProperty({ description: 'Trạng thái activity', enum: ['in_progress', 'completed', 'abandoned'] })
  @IsIn(['in_progress', 'completed', 'abandoned'])
  @IsOptional()
  status?: string

  @ApiProperty({ description: 'Điểm số' })
  @IsNumber()
  @IsOptional()
  score?: number

  @ApiProperty({ description: 'Thời gian làm bài' })
  @IsNumber()
  @IsOptional()
  timeSpent?: number

  @ApiProperty({ description: 'Câu trả lời' })
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>

  @ApiProperty({ description: 'Phản hồi' })
  @IsString()
  @IsOptional()
  feedback?: string
}

export class ActivityResultResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  studentId!: string

  @ApiProperty()
  activityId!: string

  @ApiProperty({ enum: ['in_progress', 'completed', 'abandoned'] })
  status!: string

  @ApiProperty()
  score?: number

  @ApiProperty()
  maxScore?: number

  @ApiProperty()
  percentage?: number

  @ApiProperty()
  timeSpent?: number

  @ApiProperty()
  timeLimit?: number

  @ApiProperty()
  answers?: Record<string, any>

  @ApiProperty()
  correctAnswers?: Record<string, any>

  @ApiProperty()
  feedback?: string

  @ApiProperty()
  startedAt?: Date

  @ApiProperty()
  completedAt?: Date

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
} 