import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { StudentEnrollment, EnrollmentStatus } from '../entities/student-enrollment.entity'
import { User, UserRole } from '../entities/user.entity'
import { Class, ClassStatus } from '../entities/class.entity'
import { CreateStudentEnrollmentDto, UpdateStudentEnrollmentDto } from '../dto/student-enrollment.dto'

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectRepository(StudentEnrollment)
    private enrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private dataSource: DataSource
  ) {}

  async enrollStudent(enrollmentData: { studentId: string; classId: string }): Promise<StudentEnrollment> {
    const { studentId, classId } = enrollmentData

    try {
      // Kiểm tra student có tồn tại và có role student không
      const studentResult = await this.dataSource.query(`
        SELECT id, role, "isActive"
        FROM users
        WHERE id = $1 AND role = $2 AND "isActive" = $3
        LIMIT 1
      `, [studentId, UserRole.STUDENT, true])

      if (studentResult.length === 0) {
        throw new NotFoundException('Student không tồn tại hoặc không có quyền truy cập')
      }

      // Kiểm tra class có tồn tại và active không
      const classResult = await this.dataSource.query(`
        SELECT id, status, "maxStudents"
        FROM classes
        WHERE id = $1 AND status = $2
        LIMIT 1
      `, [classId, ClassStatus.ACTIVE])

      if (classResult.length === 0) {
        throw new NotFoundException('Lớp học không tồn tại hoặc không active')
      }

      const classItem = classResult[0]

      // Kiểm tra class có còn chỗ không
      const currentEnrollmentsResult = await this.dataSource.query(`
        SELECT COUNT(*) as count
        FROM student_enrollments
        WHERE "classId" = $1 AND status = $2
      `, [classId, EnrollmentStatus.ACTIVE])

      const currentEnrollments = parseInt(currentEnrollmentsResult[0]?.count || '0')
      if (currentEnrollments >= classItem.maxStudents) {
        throw new BadRequestException('Lớp học đã đầy, không thể đăng ký thêm')
      }

      // Kiểm tra student đã đăng ký lớp này chưa
      const existingEnrollmentResult = await this.dataSource.query(`
        SELECT id, status
        FROM student_enrollments
        WHERE "studentId" = $1 AND "classId" = $2
        LIMIT 1
      `, [studentId, classId])

      if (existingEnrollmentResult.length > 0) {
        const existingEnrollment = existingEnrollmentResult[0]
        if (existingEnrollment.status === EnrollmentStatus.ACTIVE) {
          throw new ConflictException('Student đã đăng ký lớp học này')
        } else {
          // Nếu đã đăng ký nhưng inactive, cập nhật thành active
          await this.dataSource.query(`
            UPDATE student_enrollments
            SET status = $1, "enrolledAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $2
          `, [EnrollmentStatus.ACTIVE, existingEnrollment.id])

          // Lấy enrollment đã cập nhật
          const updatedEnrollmentResult = await this.dataSource.query(`
            SELECT * FROM student_enrollments WHERE id = $1
          `, [existingEnrollment.id])

          return updatedEnrollmentResult[0]
        }
      }

      // Tạo enrollment mới bằng raw SQL
      const newEnrollmentResult = await this.dataSource.query(`
        INSERT INTO student_enrollments (
          "studentId", "classId", status, "enrolledAt", 
          "totalPoints", "completedActivities", "averageScore", 
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `, [studentId, classId, EnrollmentStatus.ACTIVE])

      return newEnrollmentResult[0]

    } catch (error) {
      console.error('❌ Error in enrollStudent:', error)
      throw error
    }
  }

  async unenrollStudent(studentId: string, classId: string): Promise<void> {
    try {
      // Sử dụng raw SQL query để tránh lỗi TypeORM relations
      const result = await this.dataSource.query(`
        SELECT id, status
        FROM student_enrollments
        WHERE "studentId" = $1 AND "classId" = $2 AND status = $3
        LIMIT 1
      `, [studentId, classId, EnrollmentStatus.ACTIVE])

      if (result.length === 0) {
        throw new NotFoundException('Không tìm thấy enrollment')
      }

      // Cập nhật status thành inactive bằng raw SQL
      await this.dataSource.query(`
        UPDATE student_enrollments
        SET status = $1, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "studentId" = $2 AND "classId" = $3
      `, [EnrollmentStatus.INACTIVE, studentId, classId])

    } catch (error) {
      console.error('❌ Error in unenrollStudent:', error)
      throw error
    }
  }

  async getStudentEnrollments(studentId: string): Promise<StudentEnrollment[]> {
    try {
      // Sử dụng class_students table để lấy danh sách lớp học đã đăng ký
      // Đây là cách hợp lý hơn: class_students quản lý enrollment, student_enrollments quản lý kết quả
      const enrollments = await this.dataSource.query(`
        SELECT 
          cs."studentId",
          cs."classId",
          c.id as "class_id",
          c.name as "class_name",
          c.description as "class_description",
          c.level as "class_level",
          c."maxStudents" as "class_maxStudents",
          c.schedule as "class_schedule",
          c.status as "class_status",
          c."createdAt" as "class_createdAt",
          c."updatedAt" as "class_updatedAt",
          c."teacherId" as "class_teacherId"
        FROM class_students cs
        LEFT JOIN classes c ON c.id = cs."classId"
        WHERE cs."studentId" = $1
        ORDER BY c."createdAt" DESC
      `, [studentId])

      // Transform raw results to match StudentEnrollment entity structure
      return enrollments.map(enrollment => ({
        id: `${enrollment.studentId}-${enrollment.classId}`, // Generate a unique ID
        studentId: enrollment.studentId,
        classId: enrollment.classId,
        status: 'active', // Default status for class_students
        enrolledAt: enrollment.class_createdAt,
        completedAt: null,
        totalPoints: 0, // Will be populated from student_enrollments if available
        completedActivities: 0, // Will be populated from student_enrollments if available
        averageScore: 0, // Will be populated from student_enrollments if available
        createdAt: enrollment.class_createdAt,
        updatedAt: enrollment.class_updatedAt,
        class: enrollment.class_id ? {
          id: enrollment.class_id,
          name: enrollment.class_name,
          description: enrollment.class_description,
          level: enrollment.class_level,
          maxStudents: enrollment.class_maxStudents,
          schedule: enrollment.class_schedule,
          status: enrollment.class_status,
          createdAt: enrollment.class_createdAt,
          updatedAt: enrollment.class_updatedAt,
          teacherId: enrollment.class_teacherId
        } : null
      }))
    } catch (error) {
      console.error('❌ Error in getStudentEnrollments:', error)
      throw error
    }
  }

  async getClassEnrollments(classId: string): Promise<StudentEnrollment[]> {
    try {
      // Sử dụng class_students table để lấy danh sách học sinh trong lớp
      // Đây là cách hợp lý hơn: class_students quản lý enrollment, student_enrollments quản lý kết quả
      const enrollments = await this.dataSource.query(`
        SELECT 
          cs."studentId",
          cs."classId",
          u.id as "student_id",
          u.name as "student_name",
          u.phone as "student_phone",
          u.role as "student_role",
          u.avatar as "student_avatar",
          u."isActive" as "student_isActive",
          u."createdAt" as "student_createdAt",
          u."updatedAt" as "student_updatedAt"
        FROM class_students cs
        LEFT JOIN users u ON u.id = cs."studentId"
        WHERE cs."classId" = $1
        ORDER BY u."createdAt" ASC
      `, [classId])

      // Transform raw results to match StudentEnrollment entity structure
      return enrollments.map(enrollment => ({
        id: `${enrollment.studentId}-${enrollment.classId}`, // Generate a unique ID
        studentId: enrollment.studentId,
        classId: enrollment.classId,
        status: 'active', // Default status for class_students
        enrolledAt: enrollment.student_createdAt,
        completedAt: null,
        totalPoints: 0, // Will be populated from student_enrollments if available
        completedActivities: 0, // Will be populated from student_enrollments if available
        averageScore: 0, // Will be populated from student_enrollments if available
        createdAt: enrollment.student_createdAt,
        updatedAt: enrollment.student_updatedAt,
        student: enrollment.student_id ? {
          id: enrollment.student_id,
          name: enrollment.student_name,
          phone: enrollment.student_phone,
          role: enrollment.student_role,
          avatar: enrollment.student_avatar,
          isActive: enrollment.student_isActive,
          createdAt: enrollment.student_createdAt,
          updatedAt: enrollment.student_updatedAt
        } : null
      }))
    } catch (error) {
      console.error('❌ Error in getClassEnrollments:', error)
      throw error
    }
  }

  async updateEnrollment(
    studentId: string,
    classId: string,
    updateDto: UpdateStudentEnrollmentDto
  ): Promise<StudentEnrollment> {
    try {
      // Sử dụng raw SQL query để tránh lỗi TypeORM relations
      const result = await this.dataSource.query(`
        SELECT id
        FROM student_enrollments
        WHERE "studentId" = $1 AND "classId" = $2
        LIMIT 1
      `, [studentId, classId])

      if (result.length === 0) {
        throw new NotFoundException('Không tìm thấy enrollment')
      }

      // Cập nhật enrollment bằng raw SQL
      const updateFields = []
      const updateValues = []
      let paramIndex = 1

      if (updateDto.status !== undefined) {
        updateFields.push(`status = $${paramIndex}`)
        updateValues.push(updateDto.status)
        paramIndex++
      }

      if (updateDto.completedAt !== undefined) {
        updateFields.push(`"completedAt" = $${paramIndex}`)
        updateValues.push(updateDto.completedAt)
        paramIndex++
      }

      if (updateFields.length === 0) {
        throw new BadRequestException('Không có trường nào để cập nhật')
      }

      // Thêm updatedAt và WHERE clause
      updateFields.push(`"updatedAt" = CURRENT_TIMESTAMP`)
      updateValues.push(studentId, classId)

      const updateQuery = `
        UPDATE student_enrollments 
        SET ${updateFields.join(', ')}
        WHERE "studentId" = $${paramIndex} AND "classId" = $${paramIndex + 1}
        RETURNING *
      `

      const updatedResult = await this.dataSource.query(updateQuery, updateValues)

      return updatedResult[0]

    } catch (error) {
      console.error('❌ Error in updateEnrollment:', error)
      throw error
    }
  }

  async getEnrollmentStats(studentId: string): Promise<{
    totalClasses: number
    activeClasses: number
    totalPoints: number
    averageScore: number
    completedActivities: number
  }> {
    try {
      // Sử dụng class_students table để đếm số lớp học đã đăng ký
      // Đây là cách hợp lý hơn: class_students quản lý enrollment, student_enrollments quản lý kết quả
      const classCountResult = await this.dataSource.query(`
        SELECT COUNT(*) as count
        FROM class_students cs
        WHERE cs."studentId" = $1
      `, [studentId])

      const totalClasses = parseInt(classCountResult[0]?.count || '0')
      const activeClasses = totalClasses // Tất cả classes trong class_students đều active

      // Lấy thống kê từ student_enrollments nếu có
      const statsResult = await this.dataSource.query(`
        SELECT 
          COALESCE(SUM("totalPoints"), 0) as totalPoints,
          COALESCE(SUM("completedActivities"), 0) as totalActivities,
          CASE 
            WHEN COUNT(*) > 0 THEN COALESCE(AVG("averageScore"), 0)
            ELSE 0 
          END as averageScore
        FROM student_enrollments 
        WHERE "studentId" = $1
      `, [studentId])

      const totalPoints = parseInt(statsResult[0]?.totalPoints || '0')
      const totalActivities = parseInt(statsResult[0]?.totalActivities || '0')
      const averageScore = parseFloat(statsResult[0]?.averageScore || '0')

      return {
        totalClasses,
        activeClasses,
        totalPoints,
        averageScore: Math.round(averageScore * 100) / 100,
        completedActivities: totalActivities
      }
    } catch (error) {
      console.error('❌ Error in getEnrollmentStats:', error)
      throw error
    }
  }

  async updateEnrollmentStats(
    studentId: string,
    classId: string,
    points: number,
    activityCompleted: boolean = false
  ): Promise<void> {
    try {
      // Sử dụng class_students table để kiểm tra enrollment
      const enrollmentCheck = await this.dataSource.query(`
        SELECT cs."studentId", cs."classId"
        FROM class_students cs
        WHERE cs."studentId" = $1 AND cs."classId" = $2
        LIMIT 1
      `, [studentId, classId])

      if (enrollmentCheck.length === 0) {
        throw new NotFoundException('Không tìm thấy enrollment')
      }

      // Kiểm tra hoặc tạo record trong student_enrollments để lưu stats
      const statsResult = await this.dataSource.query(`
        SELECT 
          se.id,
          se."totalPoints",
          se."completedActivities"
        FROM student_enrollments se
        WHERE se."studentId" = $1 AND se."classId" = $2
        LIMIT 1
      `, [studentId, classId])

      let newCompletedActivities = 0
      let newTotalPoints = 0

      if (statsResult.length > 0) {
        // Cập nhật stats hiện có
        const enrollment = statsResult[0]
        newCompletedActivities = enrollment.completedActivities
        newTotalPoints = enrollment.totalPoints
      }

      if (activityCompleted) {
        newCompletedActivities += 1
      }

      newTotalPoints += points
      
      // Cập nhật average score (giả sử mỗi activity có điểm tối đa là 100)
      let newAverageScore = 0
      if (newCompletedActivities > 0) {
        newAverageScore = newTotalPoints / newCompletedActivities
      }

      // Upsert stats vào student_enrollments
      await this.dataSource.query(`
        INSERT INTO student_enrollments (
          "studentId", "classId", status, "enrolledAt",
          "totalPoints", "completedActivities", "averageScore",
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, 'active', CURRENT_TIMESTAMP, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("studentId", "classId") DO UPDATE SET
          "totalPoints" = EXCLUDED."totalPoints",
          "completedActivities" = EXCLUDED."completedActivities",
          "averageScore" = EXCLUDED."averageScore",
          "updatedAt" = CURRENT_TIMESTAMP
      `, [studentId, classId, newTotalPoints, newCompletedActivities, newAverageScore])

    } catch (error) {
      console.error('❌ Error in updateEnrollmentStats:', error)
      throw error
    }
  }

  // === CÁC METHODS MỚI CHO STUDENT LEARNING DASHBOARD ===

  async getStudentLearningDashboard(studentId: string): Promise<any> {
    try {
      console.log('🔍 Loading dashboard for student:', studentId)
      
      // Sử dụng class_students table để lấy danh sách lớp học đã đăng ký
      // Đây là cách hợp lý hơn: class_students quản lý enrollment, student_enrollments quản lý kết quả
      const enrollments = await this.dataSource.query(`
        SELECT 
          cs."studentId",
          cs."classId",
          c.id as "classId",
          c.name as "className",
          c.description as "classDescription",
          c.level as "classLevel",
          c."maxStudents",
          c.schedule,
          c.status as "classStatus",
          c."createdAt" as "classCreatedAt",
          c."updatedAt" as "classUpdatedAt",
          c."teacherId"
        FROM class_students cs
        LEFT JOIN classes c ON c.id = cs."classId"
        WHERE cs."studentId" = $1
        ORDER BY c."createdAt" DESC
      `, [studentId])

      console.log('🔍 Found enrollments from class_students:', enrollments.length)

      // Nếu không có enrollment, trả về dashboard trống
      if (enrollments.length === 0) {
        return {
          studentId,
          totalClasses: 0,
          classes: []
        }
      }

      // Lấy thông tin chi tiết cho mỗi lớp
      const classes = await Promise.all(
        enrollments.map(async (enrollment) => {
          console.log('🔍 Processing class:', enrollment.classId, enrollment.className)
          
          try {
            // Lấy số bài học trong lớp
            const lessonCountResult = await this.dataSource.query(`
              SELECT COUNT(*) as count
              FROM lessons l
              WHERE l."classId" = $1
            `, [enrollment.classId])

            const lessonCountValue = parseInt(lessonCountResult[0]?.count || '0')

            // Lấy thông tin từ student_enrollments nếu có (để lấy điểm số, tiến độ)
            const enrollmentStats = await this.dataSource.query(`
              SELECT 
                "totalPoints",
                "completedActivities",
                "averageScore",
                "enrolledAt"
              FROM student_enrollments 
              WHERE "studentId" = $1 AND "classId" = $2
              LIMIT 1
            `, [studentId, enrollment.classId])

            const stats = enrollmentStats.length > 0 ? enrollmentStats[0] : {
              totalPoints: 0,
              completedActivities: 0,
              averageScore: 0,
              enrolledAt: null
            }

            return {
              classId: enrollment.classId,
              className: enrollment.className,
              classDescription: enrollment.classDescription || '',
              classLevel: enrollment.classLevel || 'Beginner',
              enrolledAt: stats.enrolledAt || enrollment.classCreatedAt,
              totalPoints: stats.totalPoints || 0,
              completedActivities: stats.completedActivities || 0,
              averageScore: stats.averageScore || 0,
              lessonCount: lessonCountValue
            }
          } catch (error) {
            console.error('❌ Error processing class:', enrollment.classId, error)
            // Return basic class info if there's an error
            return {
              classId: enrollment.classId,
              className: enrollment.className,
              classDescription: enrollment.classDescription || '',
              classLevel: enrollment.classLevel || 'Beginner',
              enrolledAt: enrollment.classCreatedAt,
              totalPoints: 0,
              completedActivities: 0,
              averageScore: 0,
              lessonCount: 0
            }
          }
        })
      )

      const dashboard = {
        studentId,
        totalClasses: enrollments.length,
        classes
      }

      console.log('✅ Dashboard created from class_students:', dashboard)
      return dashboard

    } catch (error) {
      console.error('❌ Error in getStudentLearningDashboard:', error)
      throw error
    }
  }

  async getStudentEnrollmentByClass(studentId: string, classId: string): Promise<StudentEnrollment | null> {
    try {
      // Kiểm tra enrollment từ class_students table
      const enrollmentCheck = await this.dataSource.query(`
        SELECT cs."studentId", cs."classId"
        FROM class_students cs
        WHERE cs."studentId" = $1 AND cs."classId" = $2
        LIMIT 1
      `, [studentId, classId])

      if (enrollmentCheck.length === 0) {
        return null
      }

      // Lấy stats từ student_enrollments nếu có
      const statsResult = await this.dataSource.query(`
        SELECT 
          se.id,
          se."studentId",
          se."classId",
          se.status,
          se."enrolledAt",
          se."completedAt",
          se."totalPoints",
          se."completedActivities",
          se."averageScore",
          se."createdAt",
          se."updatedAt"
        FROM student_enrollments se
        WHERE se."studentId" = $1 AND se."classId" = $2
        LIMIT 1
      `, [studentId, classId])

      if (statsResult.length > 0) {
        return statsResult[0]
      }

      // Nếu không có stats, tạo record mới với thông tin cơ bản
      const newEnrollment: any = {
        id: `temp-${Date.now()}`,
        studentId,
        classId,
        status: EnrollmentStatus.ACTIVE,
        enrolledAt: new Date().toISOString(),
        completedAt: null,
        totalPoints: 0,
        completedActivities: 0,
        averageScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return newEnrollment
    } catch (error) {
      console.error('❌ Error in getStudentEnrollmentByClass:', error)
      return null
    }
  }

  async getClassLessonsForStudent(studentId: string, classId: string): Promise<any[]> {
    // Kiểm tra student có được thêm vào lớp học này không
    const enrollment = await this.getStudentEnrollmentByClass(studentId, classId)
    if (!enrollment) {
      throw new NotFoundException('Student chưa được thêm vào lớp học này')
    }

    // Lấy tất cả bài học trong lớp
    const lessons = await this.dataSource
      .createQueryBuilder()
      .select([
        'l.id as id',
        'l.title as title',
        'l.description as description',
        'l.order as "order"',
        'l.createdAt as "createdAt"'
      ])
      .from('lessons', 'l')
      .where('l.classId = :classId', { classId })
      .orderBy('l.order', 'ASC')
      .getRawMany()

    // Lấy số activities trong mỗi bài học
    const lessonsWithActivityCount = await Promise.all(
      lessons.map(async (lesson) => {
        const activityCount = await this.dataSource
          .createQueryBuilder()
          .select('COUNT(*)', 'count')
          .from('activities', 'a')
          .where('a.lessonId = :lessonId', { lessonId: lesson.id })
          .getRawOne()

        return {
          ...lesson,
          activityCount: parseInt(activityCount.count) || 0
        }
      })
    )

    return lessonsWithActivityCount
  }

  async checkStudentLessonAccess(studentId: string, lessonId: string): Promise<boolean> {
    try {
      // Kiểm tra student có quyền xem bài học này không
      const result = await this.dataSource.query(`
        SELECT cs."studentId"
        FROM class_students cs
        INNER JOIN lessons l ON l."classId" = cs."classId"
        WHERE cs."studentId" = $1 AND l.id = $2
        LIMIT 1
      `, [studentId, lessonId])

      return result.length > 0
    } catch (error) {
      console.error('❌ Error in checkStudentLessonAccess:', error)
      return false
    }
  }

  async getLessonActivitiesForStudent(studentId: string, lessonId: string): Promise<any[]> {
    try {
      // Kiểm tra quyền truy cập - student phải được thêm vào lớp học chứa bài học này
      const hasAccess = await this.checkStudentLessonAccess(studentId, lessonId)
      if (!hasAccess) {
        throw new NotFoundException('Student không có quyền xem bài học này')
      }

      // Lấy tất cả activities trong bài học bằng raw SQL
      const activities = await this.dataSource.query(`
        SELECT 
          a.id,
          a.title,
          a.description,
          a.type,
          a.difficulty,
          a."estimatedTime",
          a.points,
          a."createdAt"
        FROM activities a
        WHERE a."lessonId" = $1
        ORDER BY a."createdAt" ASC
      `, [lessonId])

      return activities
    } catch (error) {
      console.error('❌ Error in getLessonActivitiesForStudent:', error)
      throw error
    }
  }

  async checkStudentActivityAccess(studentId: string, activityId: string): Promise<boolean> {
    // Kiểm tra student có quyền xem activity này không
    const result = await this.dataSource
      .createQueryBuilder()
      .select('se.id')
      .from('student_enrollments', 'se')
      .innerJoin('lessons', 'l', 'l.classId = se.classId')
      .innerJoin('activities', 'a', 'a.lessonId = l.id')
      .where('se.studentId = :studentId', { studentId })
      .andWhere('a.id = :activityId', { activityId })
      .andWhere('se.status = :status', { status: EnrollmentStatus.ACTIVE })
      .getOne()

    return !!result
  }

  async getActivityForStudent(studentId: string, activityId: string): Promise<any> {
    try {
      // Kiểm tra quyền truy cập - student phải được thêm vào lớp học chứa activity này
      const hasAccess = await this.checkStudentActivityAccess(studentId, activityId)
      if (!hasAccess) {
        throw new NotFoundException('Student không có quyền xem activity này')
      }

      // Lấy chi tiết activity bằng raw SQL
      const activity = await this.dataSource.query(`
        SELECT 
          a.id,
          a.title,
          a.description,
          a.type,
          a.difficulty,
          a."estimatedTime",
          a.points,
          a."timeLimit",
          a."readingText",
          a."audioUrl",
          a.transcript,
          a.prompt,
          a."targetPhrases",
          a."recordingTime",
          a."createdAt"
        FROM activities a
        WHERE a.id = $1
        LIMIT 1
      `, [activityId])

      if (activity.length === 0) {
        throw new NotFoundException('Activity không tồn tại')
      }

      const activityData = activity[0]

      // Lấy thông tin bài học và lớp học
      const lessonInfo = await this.dataSource.query(`
        SELECT 
          l.id as "lessonId",
          l.title as "lessonTitle",
          c.id as "classId",
          c.name as "className"
        FROM lessons l
        INNER JOIN classes c ON c.id = l."classId"
        WHERE l.id = (SELECT "lessonId" FROM activities WHERE id = $1)
        LIMIT 1
      `, [activityId])

      const lessonData = lessonInfo.length > 0 ? lessonInfo[0] : {
        lessonId: '',
        lessonTitle: '',
        classId: '',
        className: ''
      }

      return {
        ...activityData,
        lesson: lessonData
      }
    } catch (error) {
      console.error('❌ Error in getActivityForStudent:', error)
      throw error
    }
  }

  async getStudentProgress(studentId: string): Promise<any> {
    try {
      console.log('🔍 Loading progress for student:', studentId)
      
      // Sử dụng class_students table để lấy danh sách lớp học đã đăng ký
      // Đây là cách hợp lý hơn: class_students quản lý enrollment, student_enrollments quản lý kết quả
      const enrollments = await this.dataSource.query(`
        SELECT 
          cs."studentId",
          cs."classId",
          c.id as "classId",
          c.name as "className"
        FROM class_students cs
        LEFT JOIN classes c ON c.id = cs."classId"
        WHERE cs."studentId" = $1
      `, [studentId])

      console.log('🔍 Found enrollments from class_students for progress:', enrollments.length)

      if (enrollments.length === 0) {
        return {
          studentId,
          totalClasses: 0,
          totalPoints: 0,
          totalCompletedActivities: 0,
          averageScore: 0,
          classProgress: []
        }
      }

      // Lấy thống kê tổng từ student_enrollments
      const totalStatsResult = await this.dataSource.query(`
        SELECT 
          COALESCE(SUM("totalPoints"), 0) as totalPoints,
          COALESCE(SUM("completedActivities"), 0) as totalActivities,
          CASE 
            WHEN COUNT(*) > 0 THEN COALESCE(AVG("averageScore"), 0)
            ELSE 0 
          END as averageScore
        FROM student_enrollments 
        WHERE "studentId" = $1
      `, [studentId])

      const totalPoints = parseInt(totalStatsResult[0]?.totalPoints || '0')
      const totalCompletedActivities = parseInt(totalStatsResult[0]?.totalActivities || '0')
      const averageScore = parseFloat(totalStatsResult[0]?.averageScore || '0')

      // Lấy tiến độ chi tiết cho mỗi lớp
      const classProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            // Lấy tổng số activities trong lớp
            const totalActivitiesResult = await this.dataSource.query(`
              SELECT COUNT(*) as count
              FROM activities a
              INNER JOIN lessons l ON l.id = a."lessonId"
              WHERE l."classId" = $1
            `, [enrollment.classId])

            const totalActivitiesCount = parseInt(totalActivitiesResult[0]?.count || '0')

            // Lấy thống kê từ student_enrollments nếu có
            const classStatsResult = await this.dataSource.query(`
              SELECT 
                "totalPoints",
                "completedActivities",
                "averageScore"
              FROM student_enrollments 
              WHERE "studentId" = $1 AND "classId" = $2
              LIMIT 1
            `, [studentId, enrollment.classId])

            const classStats = classStatsResult.length > 0 ? classStatsResult[0] : {
              totalPoints: 0,
              completedActivities: 0,
              averageScore: 0
            }

            const completionRate = totalActivitiesCount > 0 ? (classStats.completedActivities || 0) / totalActivitiesCount * 100 : 0

            return {
              classId: enrollment.classId,
              className: enrollment.className,
              totalActivities: totalActivitiesCount,
              completedActivities: classStats.completedActivities || 0,
              completionRate: Math.round(completionRate * 100) / 100,
              totalPoints: classStats.totalPoints || 0,
              averageScore: classStats.averageScore || 0
            }
          } catch (error) {
            console.error('❌ Error processing class progress:', enrollment.classId, error)
            // Return basic progress info if there's an error
            return {
              classId: enrollment.classId,
              className: enrollment.className,
              totalActivities: 0,
              completedActivities: 0,
              completionRate: 0,
              totalPoints: 0,
              averageScore: 0
            }
          }
        })
      )

      const progress = {
        studentId,
        totalClasses: enrollments.length,
        totalPoints,
        totalCompletedActivities,
        averageScore: Math.round(averageScore * 100) / 100,
        classProgress
      }

      console.log('✅ Progress created from class_students:', progress)
      return progress

    } catch (error) {
      console.error('❌ Error in getStudentProgress:', error)
      throw error
    }
  }
} 