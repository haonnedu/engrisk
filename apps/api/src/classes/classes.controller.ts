import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Class, ClassLevel, ClassStatus } from '../entities/class.entity';
import { CreateClassDto, UpdateClassDto, AddStudentToClassDto, RemoveStudentFromClassDto, ClassResponseDto } from '../dto/class.dto';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all classes with pagination' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully', type: [ClassResponseDto] })
  async list(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.classesService.list(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully', type: ClassResponseDto })
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, description: 'Class retrieved successfully', type: ClassResponseDto })
  async byId(@Param('id') id: string) {
    return this.classesService.byId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully', type: ClassResponseDto })
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete class' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Get all students in a class' })
  @ApiResponse({ status: 200, description: 'Class students retrieved successfully' })
  async getClassStudents(@Param('id') id: string) {
    return this.classesService.getClassStudents(id);
  }

  @Post(':id/students')
  @ApiOperation({ summary: 'Add student to class' })
  @ApiResponse({ status: 201, description: 'Student added to class successfully' })
  async addStudentToClass(@Param('id') classId: string, @Body() addStudentDto: AddStudentToClassDto) {
    return this.classesService.addStudentToClass(classId, addStudentDto.studentId);
  }

  @Delete(':id/students/:studentId')
  @ApiOperation({ summary: 'Remove student from class' })
  @ApiResponse({ status: 200, description: 'Student removed from class successfully' })
  async removeStudentFromClass(@Param('id') classId: string, @Param('studentId') studentId: string) {
    return this.classesService.removeStudentFromClass(classId, studentId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get classes by teacher ID' })
  @ApiResponse({ status: 200, description: 'Teacher classes retrieved successfully', type: [ClassResponseDto] })
  async getClassesByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.getClassesByTeacher(teacherId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get classes where student is enrolled' })
  @ApiResponse({ status: 200, description: 'Student classes retrieved successfully', type: [ClassResponseDto] })
  async getClassesByStudent(@Param('studentId') studentId: string) {
    return this.classesService.getClassesByStudent(studentId);
  }

  @Get('user/:userId/role/:role')
  @ApiOperation({ summary: 'Get classes by user role (teacher/student/admin)' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully by role', type: [ClassResponseDto] })
  async getClassesByRole(
    @Param('userId') userId: string,
    @Param('role') role: string
  ) {
    return this.classesService.getClassesByRole(userId, role);
  }
}