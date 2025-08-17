import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ActivityResultService } from '../services/activity-result.service'
import { StartActivityDto, SubmitActivityDto, UpdateActivityResultDto, ActivityResultResponseDto } from '../dto/activity-result.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Activity Results')
@Controller('activity-results')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityResultController {
  constructor(private readonly resultService: ActivityResultService) {}

  @Post('start')
  @ApiOperation({ summary: 'Student bắt đầu làm activity' })
  @ApiResponse({ status: 201, description: 'Bắt đầu thành công', type: ActivityResultResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Student hoặc activity không tồn tại' })
  async startActivity(
    @Body() startActivityDto: StartActivityDto,
    @Request() req: any
  ): Promise<ActivityResultResponseDto> {
    // Kiểm tra quyền - chỉ student mới có thể bắt đầu activity
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể bắt đầu activity')
    }

    // Đảm bảo studentId trong DTO khớp với user đang đăng nhập
    if (startActivityDto.studentId !== req.user.id) {
      throw new Error('Không thể bắt đầu activity cho student khác')
    }

    return this.resultService.startActivity(startActivityDto)
  }

  @Post('submit')
  @ApiOperation({ summary: 'Student nộp bài activity' })
  @ApiResponse({ status: 201, description: 'Nộp bài thành công', type: ActivityResultResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy activity result' })
  async submitActivity(
    @Body() submitActivityDto: SubmitActivityDto,
    @Request() req: any
  ): Promise<ActivityResultResponseDto> {
    // Kiểm tra quyền - chỉ student mới có thể nộp bài
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể nộp bài')
    }

    // Đảm bảo studentId trong DTO khớp với user đang đăng nhập
    if (submitActivityDto.studentId !== req.user.id) {
      throw new Error('Không thể nộp bài cho student khác')
    }

    return this.resultService.submitActivity(submitActivityDto)
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lấy kết quả activities của student' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: [ActivityResultResponseDto] })
  @ApiResponse({ status: 404, description: 'Student không tồn tại' })
  async getStudentActivityResults(
    @Param('studentId') studentId: string,
    @Request() req: any
  ): Promise<ActivityResultResponseDto[]> {
    // Kiểm tra quyền - student chỉ có thể xem kết quả của mình
    if (req.user.role === 'student' && req.user.id !== studentId) {
      throw new Error('Không thể xem kết quả của student khác')
    }

    return this.resultService.getStudentActivityResults(studentId)
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Lấy kết quả activities của class' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: [ActivityResultResponseDto] })
  @ApiResponse({ status: 404, description: 'Class không tồn tại' })
  async getClassActivityResults(
    @Param('classId') classId: string,
    @Request() req: any
  ): Promise<ActivityResultResponseDto[]> {
    // Kiểm tra quyền - chỉ teacher của lớp hoặc admin mới có thể xem
    if (req.user.role === 'student') {
      throw new Error('Student không thể xem kết quả của class')
    }

    return this.resultService.getClassActivityResults(classId)
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Lấy kết quả của một activity cụ thể' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: ActivityResultResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy activity result' })
  async getActivityResult(
    @Param('activityId') activityId: string,
    @Request() req: any
  ): Promise<ActivityResultResponseDto> {
    // Student chỉ có thể xem kết quả của mình
    if (req.user.role === 'student') {
      return this.resultService.getActivityResult(req.user.id, activityId)
    }

    // Teacher/Admin có thể xem tất cả kết quả
    throw new Error('Endpoint này chỉ dành cho student')
  }

  @Put(':activityId')
  @ApiOperation({ summary: 'Cập nhật kết quả activity' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: ActivityResultResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy activity result' })
  async updateActivityResult(
    @Param('activityId') activityId: string,
    @Body() updateDto: UpdateActivityResultDto,
    @Request() req: any
  ): Promise<ActivityResultResponseDto> {
    // Kiểm tra quyền - chỉ teacher hoặc admin mới có thể cập nhật
    if (req.user.role === 'student') {
      throw new Error('Student không thể cập nhật kết quả')
    }

    return this.resultService.updateActivityResult(req.user.id, activityId, updateDto)
  }

  @Post('abandon/:activityId')
  @ApiOperation({ summary: 'Student bỏ dở activity' })
  @ApiResponse({ status: 200, description: 'Bỏ dở thành công', type: ActivityResultResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy activity result' })
  async abandonActivity(
    @Param('activityId') activityId: string,
    @Request() req: any
  ): Promise<ActivityResultResponseDto> {
    // Kiểm tra quyền - chỉ student mới có thể bỏ dở
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể bỏ dở activity')
    }

    return this.resultService.abandonActivity(req.user.id, activityId)
  }

  @Get('progress/:studentId')
  @ApiOperation({ summary: 'Lấy tiến độ học tập của student' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  @ApiResponse({ status: 404, description: 'Student không tồn tại' })
  async getStudentProgress(
    @Param('studentId') studentId: string,
    @Request() req: any
  ): Promise<any> {
    // Kiểm tra quyền - student chỉ có thể xem tiến độ của mình
    if (req.user.role === 'student' && req.user.id !== studentId) {
      throw new Error('Không thể xem tiến độ của student khác')
    }

    return this.resultService.getStudentProgress(studentId)
  }

  @Get('my-progress')
  @ApiOperation({ summary: 'Lấy tiến độ học tập của student đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Lấy thành công' })
  async getMyProgress(@Request() req: any): Promise<any> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.resultService.getStudentProgress(req.user.id)
  }

  @Get('my-results')
  @ApiOperation({ summary: 'Lấy kết quả activities của student đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Lấy thành công', type: [ActivityResultResponseDto] })
  async getMyResults(@Request() req: any): Promise<ActivityResultResponseDto[]> {
    if (req.user.role !== 'student') {
      throw new Error('Chỉ student mới có thể sử dụng endpoint này')
    }

    return this.resultService.getStudentActivityResults(req.user.id)
  }
} 