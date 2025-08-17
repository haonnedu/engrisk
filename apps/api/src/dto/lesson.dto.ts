import { IsString, IsEnum, IsNumber, IsArray, IsOptional, Min, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LessonDifficulty, LessonStatus } from '../entities/lesson.entity'

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson title' })
  @IsString()
  title!: string

  @ApiProperty({ description: 'Lesson description' })
  @IsString()
  description!: string

  @ApiProperty({ description: 'Class ID' })
  @IsUUID()
  classId!: string

  @ApiProperty({ description: 'Lesson difficulty', enum: LessonDifficulty })
  @IsEnum(LessonDifficulty)
  difficulty!: LessonDifficulty

  @ApiProperty({ description: 'Lesson duration in minutes', minimum: 1 })
  @IsNumber()
  @Min(1)
  duration!: number

  @ApiProperty({ description: 'Lesson status', enum: LessonStatus, default: LessonStatus.DRAFT })
  @IsEnum(LessonStatus)
  @IsOptional()
  status?: LessonStatus

  @ApiProperty({ description: 'Learning objectives', type: [String] })
  @IsArray()
  @IsString({ each: true })
  objectives!: string[]

  @ApiProperty({ description: 'Learning materials', type: [String] })
  @IsArray()
  @IsString({ each: true })
  materials!: string[]
}

export class UpdateLessonDto {
  @ApiProperty({ description: 'Lesson title', required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ description: 'Lesson description', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: 'Lesson difficulty', enum: LessonDifficulty, required: false })
  @IsEnum(LessonDifficulty)
  @IsOptional()
  difficulty?: LessonDifficulty

  @ApiProperty({ description: 'Lesson duration in minutes', minimum: 1, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number

  @ApiProperty({ description: 'Lesson status', enum: LessonStatus, required: false })
  @IsEnum(LessonStatus)
  @IsOptional()
  status?: LessonStatus

  @ApiProperty({ description: 'Learning objectives', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  objectives?: string[]

  @ApiProperty({ description: 'Learning materials', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  materials?: string[]
} 