import { IsString, IsEnum, IsNumber, IsArray, IsOptional, Min, IsUUID, IsBoolean, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ActivityType, ActivityDifficulty } from '../entities/activity.entity'
import { Type, Transform } from 'class-transformer'

export class QuizQuestionDto {
  @ApiProperty({ description: 'Question text' })
  @IsString()
  question!: string

  @ApiProperty({ description: 'Answer options', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => `${v}`.trim()).filter(Boolean)
    if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean)
    return []
  })
  options!: string[]

  @ApiProperty({ description: 'Index of correct answer' })
  @IsNumber()
  correctAnswer!: number

  @ApiProperty({ description: 'Explanation for the answer', required: false })
  @IsString()
  @IsOptional()
  explanation?: string
}

export class MatchingPairDto {
  @ApiProperty({ description: 'Left side of the pair' })
  @IsString()
  left!: string

  @ApiProperty({ description: 'Right side of the pair' })
  @IsString()
  right!: string

  @ApiProperty({ description: 'Whether to shuffle this pair', default: true })
  @IsBoolean()
  @IsOptional()
  shuffle?: boolean
}

export class FillBlankDto {
  @ApiProperty({ description: 'Word to fill in the blank' })
  @IsString()
  word!: string

  @ApiProperty({ description: 'Hint for the blank', required: false })
  @IsString()
  @IsOptional()
  hint?: string
}

export class CreateActivityDto {
  @ApiProperty({ description: 'Activity type', enum: ActivityType })
  @IsEnum(ActivityType)
  type!: ActivityType

  @ApiProperty({ description: 'Activity title' })
  @IsString()
  title!: string

  @ApiProperty({ description: 'Activity description' })
  @IsString()
  description!: string

  @ApiProperty({ description: 'Lesson ID' })
  @IsUUID()
  lessonId!: string

  @ApiProperty({ description: 'Activity difficulty', enum: ActivityDifficulty })
  @IsEnum(ActivityDifficulty)
  difficulty!: ActivityDifficulty

  @ApiProperty({ description: 'Estimated time in minutes', minimum: 1 })
  @IsNumber()
  @Min(1)
  estimatedTime!: number

  @ApiProperty({ description: 'Points for completing this activity' })
  @IsNumber()
  points!: number

  @ApiProperty({ description: 'Time limit in minutes', required: false })
  @IsNumber()
  @IsOptional()
  timeLimit?: number

  @ApiProperty({ description: 'Quiz questions', type: [QuizQuestionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  @IsOptional()
  quizQuestions?: QuizQuestionDto[]

  @ApiProperty({ description: 'Matching pairs', type: [MatchingPairDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchingPairDto)
  @IsOptional()
  matchingPairs?: MatchingPairDto[]

  @ApiProperty({ description: 'Fill in the blanks', type: [FillBlankDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FillBlankDto)
  @IsOptional()
  fillBlanks?: FillBlankDto[]

  @ApiProperty({ description: 'Reading text', required: false })
  @IsString()
  @IsOptional()
  readingText?: string

  @ApiProperty({ description: 'Audio URL', required: false })
  @IsString()
  @IsOptional()
  audioUrl?: string

  @ApiProperty({ description: 'Transcript', required: false })
  @IsString()
  @IsOptional()
  transcript?: string

  @ApiProperty({ description: 'Speaking prompt', required: false })
  @IsString()
  @IsOptional()
  prompt?: string

  @ApiProperty({ description: 'Target phrases', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => `${v}`.trim()).filter(Boolean)
    if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean)
    return []
  })
  targetPhrases?: string[]

  @ApiProperty({ description: 'Recording time in seconds', required: false })
  @IsNumber()
  @IsOptional()
  recordingTime?: number
}

export class UpdateActivityDto {
  @ApiProperty({ description: 'Activity title', required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ description: 'Activity description', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: 'Activity difficulty', enum: ActivityDifficulty, required: false })
  @IsEnum(ActivityDifficulty)
  @IsOptional()
  difficulty?: ActivityDifficulty

  @ApiProperty({ description: 'Estimated time in minutes', minimum: 1, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  estimatedTime?: number

  @ApiProperty({ description: 'Points for completing this activity', required: false })
  @IsNumber()
  @IsOptional()
  points?: number

  @ApiProperty({ description: 'Time limit in minutes', required: false })
  @IsNumber()
  @IsOptional()
  timeLimit?: number
} 