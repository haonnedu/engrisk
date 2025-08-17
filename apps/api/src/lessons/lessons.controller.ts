import { Body, Controller, Get, Param, Post, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LessonsService } from './lessons.service'
import { Lesson, LessonDifficulty, LessonStatus } from '../entities/lesson.entity'

interface CreateLessonDto {
  classId: string;
  title: string;
  description?: string;
  difficulty?: LessonDifficulty;
  duration?: number;
  objectives?: string[];
  materials?: string[];
  teacherId: string;
}

interface UpdateLessonDto {
  title?: string;
  description?: string;
  difficulty?: LessonDifficulty;
  duration?: number;
  status?: LessonStatus;
  objectives?: string[];
  materials?: string[];
}

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons with pagination' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.lessonsService.list(+page, +limit)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully', type: Lesson })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson retrieved successfully', type: Lesson })
  async byId(@Param('id') id: string): Promise<Lesson> {
    return this.lessonsService.byId(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully', type: Lesson })
  async update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.lessonsService.remove(id)
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get lessons by class ID' })
  @ApiResponse({ status: 200, description: 'Class lessons retrieved successfully', type: [Lesson] })
  async getLessonsByClass(@Param('classId') classId: string) {
    return this.lessonsService.getLessonsByClass(classId)
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get lessons by teacher ID' })
  @ApiResponse({ status: 200, description: 'Teacher lessons retrieved successfully', type: [Lesson] })
  async getLessonsByTeacher(@Param('teacherId') teacherId: string) {
    return this.lessonsService.getLessonsByTeacher(teacherId)
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish lesson' })
  @ApiResponse({ status: 200, description: 'Lesson published successfully', type: Lesson })
  async publishLesson(@Param('id') id: string) {
    return this.lessonsService.publishLesson(id)
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish lesson' })
  @ApiResponse({ status: 200, description: 'Lesson unpublished successfully', type: Lesson })
  async unpublishLesson(@Param('id') id: string) {
    return this.lessonsService.unpublishLesson(id)
  }
}