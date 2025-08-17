import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User, UserRole } from '../entities/user.entity';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students with pagination' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.getStudentsPaginated(page, limit);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all students (simple list)' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async getStudents() {
    return this.userService.getStudents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    // Ensure the role is set to student
    createUserDto.role = UserRole.STUDENT;
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/classes')
  @ApiOperation({ summary: 'Get classes where student is enrolled' })
  @ApiResponse({ status: 200, description: 'Student classes retrieved successfully' })
  async getStudentClasses(@Param('id') id: string) {
    return this.userService.getStudentClasses(id);
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get activities completed by student' })
  @ApiResponse({ status: 200, description: 'Student activities retrieved successfully' })
  async getStudentActivities(@Param('id') id: string) {
    return this.userService.getStudentActivities(id);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get student learning progress' })
  @ApiResponse({ status: 200, description: 'Student progress retrieved successfully' })
  async getStudentProgress(@Param('id') id: string) {
    return this.userService.getStudentProgress(id);
  }

  @Post(':id/enroll/:classId')
  @ApiOperation({ summary: 'Enroll student in a class' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully' })
  async enrollInClass(@Param('id') studentId: string, @Param('classId') classId: string) {
    return this.userService.enrollInClass(studentId, classId);
  }

  @Delete(':id/unenroll/:classId')
  @ApiOperation({ summary: 'Unenroll student from a class' })
  @ApiResponse({ status: 200, description: 'Student unenrolled successfully' })
  async unenrollFromClass(@Param('id') studentId: string, @Param('classId') classId: string) {
    return this.userService.unenrollFromClass(studentId, classId);
  }
} 