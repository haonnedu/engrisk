import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClassLevel, ClassStatus } from '../entities/class.entity';

export class CreateClassDto {
  @ApiProperty({ description: 'Class name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Class description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Class level', enum: ClassLevel, default: ClassLevel.BEGINNER })
  @IsEnum(ClassLevel)
  @IsOptional()
  level?: ClassLevel;

  @ApiProperty({ description: 'Maximum number of students', minimum: 1, maximum: 100, default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxStudents?: number;

  @ApiProperty({ description: 'Class schedule', required: false })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({ description: 'Teacher ID' })
  @IsUUID()
  teacherId!: string;
}

export class UpdateClassDto {
  @ApiProperty({ description: 'Class name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Class description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Class level', enum: ClassLevel, required: false })
  @IsEnum(ClassLevel)
  @IsOptional()
  level?: ClassLevel;

  @ApiProperty({ description: 'Maximum number of students', minimum: 1, maximum: 100, required: false })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxStudents?: number;

  @ApiProperty({ description: 'Class schedule', required: false })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({ description: 'Class status', enum: ClassStatus, required: false })
  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;
}

export class AddStudentToClassDto {
  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId!: string;
}

export class RemoveStudentFromClassDto {
  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId!: string;
}

export class ClassResponseDto {
  @ApiProperty({ description: 'Class ID' })
  id!: string;

  @ApiProperty({ description: 'Class name' })
  name!: string;

  @ApiProperty({ description: 'Class description' })
  description!: string;

  @ApiProperty({ description: 'Class level', enum: ClassLevel })
  level!: ClassLevel;

  @ApiProperty({ description: 'Maximum number of students' })
  maxStudents!: number;

  @ApiProperty({ description: 'Class schedule' })
  schedule!: string;

  @ApiProperty({ description: 'Class status', enum: ClassStatus })
  status!: ClassStatus;

  @ApiProperty({ description: 'Teacher ID' })
  teacherId!: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
} 