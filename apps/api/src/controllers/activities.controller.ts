import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityService } from '../services/activity.service';
import { CreateActivityDto, UpdateActivityDto } from '../dto/activity.dto';
import { Activity, ActivityType, ActivityDifficulty } from '../entities/activity.entity';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  async findAll() {
    return this.activityService.findAll();
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get activities by lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson activities retrieved successfully' })
  async findByLesson(@Param('lessonId') lessonId: string) {
    return this.activityService.findByLesson(lessonId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get activities by type' })
  @ApiResponse({ status: 200, description: 'Activities by type retrieved successfully' })
  async getActivitiesByType(@Param('type') type: ActivityType) {
    return this.activityService.getActivitiesByType(type);
  }

  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Get activities by difficulty' })
  @ApiResponse({ status: 200, description: 'Activities by difficulty retrieved successfully' })
  async getActivitiesByDifficulty(@Param('difficulty') difficulty: ActivityDifficulty) {
    return this.activityService.getActivitiesByDifficulty(difficulty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({ status: 200, description: 'Activity retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update activity' })
  @ApiResponse({ status: 200, description: 'Activity updated successfully' })
  async update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark activity as completed' })
  @ApiResponse({ status: 200, description: 'Activity marked as completed successfully' })
  async markAsCompleted(@Param('id') id: string, @Body() body: { score: number }) {
    return this.activityService.markAsCompleted(id, body.score);
  }

  @Get('quiz/questions/:activityId')
  @ApiOperation({ summary: 'Get quiz questions for an activity' })
  @ApiResponse({ status: 200, description: 'Quiz questions retrieved successfully' })
  async getQuizQuestions(@Param('activityId') activityId: string) {
    const activity = await this.activityService.findOne(activityId);
    return activity.quizQuestions || [];
  }

  @Get('matching/pairs/:activityId')
  @ApiOperation({ summary: 'Get matching pairs for an activity' })
  @ApiResponse({ status: 200, description: 'Matching pairs retrieved successfully' })
  async getMatchingPairs(@Param('activityId') activityId: string) {
    const activity = await this.activityService.findOne(activityId);
    return activity.matchingPairs || [];
  }

  @Get('fill-blanks/:activityId')
  @ApiOperation({ summary: 'Get fill blanks for an activity' })
  @ApiResponse({ status: 200, description: 'Fill blanks retrieved successfully' })
  async getFillBlanks(@Param('activityId') activityId: string) {
    const activity = await this.activityService.findOne(activityId);
    return activity.fillBlanks || [];
  }
} 