import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { StudentEnrollmentService } from '../services/student-enrollment.service'
import { CreateStudentEnrollmentDto, UpdateStudentEnrollmentDto, StudentEnrollmentResponseDto } from '../dto/student-enrollment.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Student Enrollment')
@Controller('student-enrollments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentEnrollmentController {
  constructor(private readonly enrollmentService: StudentEnrollmentService) {}

  @Post()
  @ApiOperation({ summary: 'Student đăng ký vào lớp học (chỉ khi cần thiết - thường giáo viên sẽ thêm student trực tiếp)' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công', type: StudentEnrollmentResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Student hoặc lớp học không tồn tại' })
  @ApiResponse({ status: 409, description: 'Student đã đăng ký lớp học này' })
  async enrollStudent(
    @Body() createEnrollmentDto: CreateStudentEnrollmentDto,
    @Request() req: any
  ): Promise<StudentEnrollmentResponseDto> {
    // Kiểm tra quyền - chỉ student mới có thể đăng ký
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể đăng ký lớp học')
    }

    // Tự động lấy studentId từ JWT token
    const studentId = req.user.id

    return this.enrollmentService.enrollStudent({
      studentId,
      classId: createEnrollmentDto.classId
    })
  }

  @Delete(':classId')
  @ApiOperation({ summary: 'Student rút khỏi lớp học' })
  @ApiResponse({ status: 200, description: 'Rút khỏi thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy enrollment' })
  async unenrollStudent(
    @Param('classId') classId: string,
    @Request() req: any
  ): Promise<void> {
    // Kiểm tra quyền
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể rút khỏi lớp học')
    }

    await this.enrollmentService.unenrollStudent(req.user.id, classId)
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lấy danh sách lớp học của student' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: [StudentEnrollmentResponseDto] })
  @ApiResponse({ status: 404, description: 'Student không tồn tại' })
  async getStudentEnrollments(
    @Param('studentId') studentId: string,
    @Request() req: any
  ): Promise<StudentEnrollmentResponseDto[]> {
    // Kiểm tra quyền - student chỉ có thể xem enrollment của mình
    if (req.user.role === 'student' && req.user.id !== studentId) {
      throw new Error('Không thể xem enrollment của student khác')
    }

    return this.enrollmentService.getStudentEnrollments(studentId)
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Lấy danh sách students trong lớp học' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: [StudentEnrollmentResponseDto] })
  @ApiResponse({ status: 404, description: 'Lớp học không tồn tại' })
  async getClassEnrollments(
    @Param('classId') classId: string,
    @Request() req: any
  ): Promise<StudentEnrollmentResponseDto[]> {
    // Kiểm tra quyền - chỉ teacher của lớp hoặc admin mới có thể xem
    if (req.user.role === 'student') {
      throw new Error('Student không thể xem danh sách students trong lớp')
    }

    return this.enrollmentService.getClassEnrollments(classId)
  }

  @Put(':classId')
  @ApiOperation({ summary: 'Cập nhật thông tin enrollment' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: StudentEnrollmentResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy enrollment' })
  async updateEnrollment(
    @Param('classId') classId: string,
    @Body() updateDto: UpdateStudentEnrollmentDto,
    @Request() req: any
  ): Promise<StudentEnrollmentResponseDto> {
    // Kiểm tra quyền - chỉ teacher của lớp hoặc admin mới có thể cập nhật
    if (req.user.role === 'student') {
      throw new Error('Student không thể cập nhật enrollment')
    }

    return this.enrollmentService.updateEnrollment(req.user.id, classId, updateDto)
  }

  @Get('stats/:studentId')
  @ApiOperation({ summary: 'Lấy thống kê enrollment của student' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  @ApiResponse({ status: 404, description: 'Student không tồn tại' })
  async getEnrollmentStats(
    @Param('studentId') studentId: string,
    @Request() req: any
  ): Promise<any> {
    // Kiểm tra quyền - student chỉ có thể xem stats của mình
    if (req.user.role === 'student' && req.user.id !== studentId) {
      throw new Error('Không thể xem stats của student khác')
    }

    return this.enrollmentService.getEnrollmentStats(studentId)
  }

  @Get('my-enrollments')
  @ApiOperation({ summary: 'Lấy danh sách lớp học của student hiện tại (tự động từ token)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: [StudentEnrollmentResponseDto] })
  @ApiResponse({ status: 404, description: 'Student không tồn tại' })
  async getMyEnrollments(@Request() req: any): Promise<StudentEnrollmentResponseDto[]> {
    // Kiểm tra quyền - chỉ student mới có thể xem enrollment của mình
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể xem enrollment của mình')
    }

    // Tự động lấy studentId từ JWT token
    const studentId = req.user.id

    return this.enrollmentService.getStudentEnrollments(studentId)
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Lấy thống kê học tập của student hiện tại (tự động từ token)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyStats(@Request() req: any): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getEnrollmentStats(req.user.id)
  }

  // === CÁC ENDPOINTS MỚI CHO STUDENT XEM NỘI DUNG HỌC TẬP ===

  @Get('my-learning-dashboard')
  @ApiOperation({ summary: 'Lấy dashboard học tập của student hiện tại (tự động từ các lớp đã được giáo viên thêm vào)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyLearningDashboard(@Request() req: any): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getStudentLearningDashboard(req.user.id)
  }

  @Get('my-classes/:classId/lessons')
  @ApiOperation({ summary: 'Lấy danh sách bài học của lớp học cho student hiện tại (tự động từ lớp đã được giáo viên thêm vào)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyClassLessons(
    @Param('classId') classId: string,
    @Request() req: any
  ): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getClassLessonsForStudent(req.user.id, classId)
  }

  @Get('my-lessons/:lessonId/activities')
  @ApiOperation({ summary: 'Lấy danh sách activities của bài học cho student hiện tại (tự động từ lớp đã được giáo viên thêm vào)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyLessonActivities(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getLessonActivitiesForStudent(req.user.id, lessonId)
  }

  @Get('my-activities/:activityId')
  @ApiOperation({ summary: 'Lấy chi tiết activity cho student hiện tại (tự động từ lớp đã được giáo viên thêm vào)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyActivity(
    @Param('activityId') activityId: string,
    @Request() req: any
  ): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getActivityForStudent(req.user.id, activityId)
  }

  @Get('my-progress')
  @ApiOperation({ summary: 'Lấy tiến độ học tập của student hiện tại (tự động từ các lớp đã được giáo viên thêm vào)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyProgress(@Request() req: any): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getStudentProgress(req.user.id)
  }

  @Get('my-classes/:classId/enrollment')
  @ApiOperation({ summary: 'Lấy thông tin enrollment của student hiện tại trong lớp học cụ thể (tự động từ token)' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: StudentEnrollmentResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy enrollment' })
  async getMyEnrollmentByClass(
    @Param('classId') classId: string,
    @Request() req: any
  ): Promise<StudentEnrollmentResponseDto> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.enrollmentService.getStudentEnrollmentByClass(req.user.id, classId)
  }

  @Get('debug/data')
  @ApiOperation({ summary: 'Debug endpoint to check data loading' })
  @ApiResponse({ status: 200, description: 'Debug info' })
  async debugData(@Request() req: any): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    try {
      // Test basic enrollment query
      const enrollments = await this.enrollmentService.getStudentEnrollments(req.user.id)
      
      // Test dashboard loading
      const dashboard = await this.enrollmentService.getStudentLearningDashboard(req.user.id)
      
      // Test progress loading
      const progress = await this.enrollmentService.getStudentProgress(req.user.id)

      return {
        success: true,
        studentId: req.user.id,
        enrollmentsCount: enrollments.length,
        dashboard: dashboard,
        progress: progress,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    }
  }
} 