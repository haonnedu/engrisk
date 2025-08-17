import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { ActivityResult, ActivityResultStatus } from '../entities/activity-result.entity'
import { Activity } from '../entities/activity.entity'
import { User, UserRole } from '../entities/user.entity'
import { StartActivityDto, SubmitActivityDto, UpdateActivityResultDto } from '../dto/activity-result.dto'
import { StudentEnrollmentService } from './student-enrollment.service'

@Injectable()
export class ActivityResultService {
  constructor(
    @InjectRepository(ActivityResult)
    private resultRepository: Repository<ActivityResult>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private studentEnrollmentService: StudentEnrollmentService,
    private dataSource: DataSource
  ) {}

  async startActivity(startActivityDto: StartActivityDto): Promise<ActivityResult> {
    const { studentId, activityId } = startActivityDto

    // Kiểm tra student có tồn tại và có role student không
    const student = await this.userRepository.findOne({
      where: { id: studentId, role: UserRole.STUDENT, isActive: true }
    })
    if (!student) {
      throw new NotFoundException('Student không tồn tại hoặc không có quyền truy cập')
    }

    // Kiểm tra activity có tồn tại không
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['lesson', 'lesson.class']
    })
    if (!activity) {
      throw new NotFoundException('Activity không tồn tại')
    }

    // Kiểm tra student có đăng ký lớp học chứa activity này không
    const classId = activity.lesson.class.id
    const enrollments = await this.studentEnrollmentService.getStudentEnrollments(studentId)
    const hasAccess = enrollments.some(e => e.classId === classId && e.status === 'active')
    
    if (!hasAccess) {
      throw new BadRequestException('Student không có quyền truy cập activity này')
    }

    // Kiểm tra xem student đã làm activity này chưa
    const existingResult = await this.resultRepository.findOne({
      where: { studentId, activityId }
    })

    if (existingResult) {
      if (existingResult.status === 'completed') {
        throw new BadRequestException('Student đã hoàn thành activity này')
      }
      // Nếu đang làm dở, cập nhật thời gian bắt đầu
      existingResult.startedAt = new Date()
      existingResult.status = ActivityResultStatus.IN_PROGRESS
      return this.resultRepository.save(existingResult)
    }

    // Tạo activity result mới
    const result = this.resultRepository.create({
      studentId,
      activityId,
      status: ActivityResultStatus.IN_PROGRESS,
      startedAt: new Date(),
      timeLimit: activity.timeLimit ? activity.timeLimit * 60 : undefined // Convert minutes to seconds
    })

    return this.resultRepository.save(result)
  }

  async submitActivity(submitActivityDto: SubmitActivityDto): Promise<ActivityResult> {
    const { studentId, activityId, timeSpent, answers, score, maxScore, percentage } = submitActivityDto

    // Kiểm tra activity result có tồn tại không
    const result = await this.resultRepository.findOne({
      where: { studentId, activityId }
    })
    if (!result) {
      throw new NotFoundException('Không tìm thấy activity result')
    }

    // Kiểm tra xem đã hoàn thành chưa
          if (result.status === 'completed') {
      throw new BadRequestException('Activity đã được hoàn thành')
    }

    // Lấy activity để lấy thông tin
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['lesson', 'lesson.class']
    })
    if (!activity) {
      throw new NotFoundException('Activity không tồn tại')
    }

    // Cập nhật kết quả
    result.status = 'completed'
    result.score = score
    result.maxScore = maxScore
    result.percentage = percentage
    result.timeSpent = timeSpent
    result.answers = answers
    result.completedAt = new Date()

    // Lưu kết quả
    const savedResult = await this.resultRepository.save(result)

    // Cập nhật enrollment stats
    const classId = activity.lesson.class.id
    await this.studentEnrollmentService.updateEnrollmentStats(
      studentId,
      classId,
      score, // Điểm số đạt được
      true // Đã hoàn thành activity
    )

    return savedResult
  }

  async getActivityResult(studentId: string, activityId: string): Promise<ActivityResult> {
    const result = await this.resultRepository.findOne({
      where: { studentId, activityId },
      relations: ['activity']
    })

    if (!result) {
      throw new NotFoundException('Không tìm thấy activity result')
    }

    return result
  }

  async getStudentActivityResults(studentId: string): Promise<ActivityResult[]> {
    return this.resultRepository.find({
      where: { studentId },
      relations: ['activity', 'activity.lesson'],
      order: { createdAt: 'DESC' }
    })
  }

  async getClassActivityResults(classId: string): Promise<ActivityResult[]> {
    // Lấy tất cả activities của class
    const activities = await this.activityRepository.find({
      where: { lesson: { classId } },
      select: ['id']
    })
    
    const activityIds = activities.map(a => a.id)
    
    return this.resultRepository.find({
      where: { activityId: { $in: activityIds } as any },
      relations: ['student', 'activity'],
      order: { createdAt: 'DESC' }
    })
  }

  async updateActivityResult(
    studentId: string,
    activityId: string,
    updateDto: UpdateActivityResultDto
  ): Promise<ActivityResult> {
    const result = await this.resultRepository.findOne({
      where: { studentId, activityId }
    })

    if (!result) {
      throw new NotFoundException('Không tìm thấy activity result')
    }

    Object.assign(result, updateDto)
    return this.resultRepository.save(result)
  }

  async abandonActivity(studentId: string, activityId: string): Promise<ActivityResult> {
    const result = await this.resultRepository.findOne({
      where: { studentId, activityId }
    })

    if (!result) {
      throw new NotFoundException('Không tìm thấy activity result')
    }

    result.status = 'abandoned'
    return this.resultRepository.save(result)
  }

  async getStudentProgress(studentId: string): Promise<{
    totalActivities: number
    completedActivities: number
    abandonedActivities: number
    totalScore: number
    averageScore: number
    totalTimeSpent: number
  }> {
    const results = await this.resultRepository.find({
      where: { studentId }
    })

    const completed = results.filter(r => r.status === 'completed')
    const abandoned = results.filter(r => r.status === 'abandoned')
    
    const totalScore = completed.reduce((sum, r) => sum + (r.score || 0), 0)
    const totalTimeSpent = completed.reduce((sum, r) => sum + (r.timeSpent || 0), 0)
    const averageScore = completed.length > 0 ? totalScore / completed.length : 0

    return {
      totalActivities: results.length,
      completedActivities: completed.length,
      abandonedActivities: abandoned.length,
      totalScore,
      averageScore: Math.round(averageScore * 100) / 100,
      totalTimeSpent
    }
  }
} 