import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User, UserRole } from '../entities/user.entity';

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teachers with pagination' })
  @ApiResponse({ status: 200, description: 'Teachers retrieved successfully' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.getTeachersPaginated(page, limit);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all teachers (simple list)' })
  @ApiResponse({ status: 200, description: 'Teachers retrieved successfully' })
  async getTeachers() {
    return this.userService.getTeachers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    // Ensure the role is set to teacher
    createUserDto.role = UserRole.TEACHER;
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update teacher' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete teacher' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/classes')
  @ApiOperation({ summary: 'Get classes taught by teacher' })
  @ApiResponse({ status: 200, description: 'Teacher classes retrieved successfully' })
  async getTeacherClasses(@Param('id') id: string) {
    return this.userService.getTeacherClasses(id);
  }

  @Get(':id/lessons')
  @ApiOperation({ summary: 'Get lessons created by teacher' })
  @ApiResponse({ status: 200, description: 'Teacher lessons retrieved successfully' })
  async getTeacherLessons(@Param('id') id: string) {
    return this.userService.getTeacherLessons(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get teacher statistics' })
  @ApiResponse({ status: 200, description: 'Teacher statistics retrieved successfully' })
  async getTeacherStatistics(@Param('id') id: string) {
    return this.userService.getTeacherStatistics(id);
  }
} 