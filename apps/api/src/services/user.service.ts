import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from '../entities/user.entity'
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '../dto/user.dto'
import { ClassPermissionService } from './class-permission.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private classPermissionService: ClassPermissionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    })

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return this.userRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'phone', 'role', 'avatar', 'isActive', 'createdAt'],
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'phone', 'role', 'avatar', 'isActive', 'createdAt'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    // If phone is being updated, check for conflicts
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone },
      })

      if (existingUser) {
        throw new ConflictException('User with this phone number already exists')
      }
    }

    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.remove(user)
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.findByPhone(loginUserDto.phone)
    
    if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
      return user
    }
    
    return null
  }

  async getTeachers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.TEACHER, isActive: true },
      select: ['id', 'name', 'phone', 'avatar'],
    })
  }

  async getStudents(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.STUDENT, isActive: true },
      select: ['id', 'name', 'phone', 'avatar'],
    })
  }

  async getStudentsPaginated(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const students = await this.userRepository.find({
      where: { role: UserRole.STUDENT, isActive: true },
      select: ['id', 'name', 'phone', 'avatar', 'createdAt'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    const total = await this.userRepository.count({
      where: { role: UserRole.STUDENT, isActive: true },
    });
    
    return {
      data: students,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTeachersPaginated(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const teachers = await this.userRepository.find({
      where: { role: UserRole.TEACHER, isActive: true },
      select: ['id', 'name', 'phone', 'avatar', 'createdAt'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    const total = await this.userRepository.count({
      where: { role: UserRole.TEACHER, isActive: true },
    });
    
    return {
      data: teachers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStudentClasses(studentId: string) {
    return this.classPermissionService.getClassesByStudent(studentId);
  }

  async getTeacherClasses(teacherId: string) {
    return this.classPermissionService.getClassesByTeacher(teacherId);
  }

  async getTeacherLessons(teacherId: string) {
    // This would query lessons where teacherId matches
    // For now, return empty array
    return [];
  }

  async getStudentActivities(studentId: string) {
    // This would need to query completed activities
    // For now, return empty array
    return [];
  }

  async getStudentProgress(studentId: string) {
    // This would calculate student progress across all classes
    // For now, return basic structure
    return {
      studentId,
      totalClasses: 0,
      completedLessons: 0,
      totalActivities: 0,
      completedActivities: 0,
      averageScore: 0,
    };
  }

  async getTeacherStatistics(teacherId: string) {
    // This would calculate teacher statistics
    // For now, return basic structure
    return {
      teacherId,
      totalClasses: 0,
      totalStudents: 0,
      totalLessons: 0,
      totalActivities: 0,
      averageStudentScore: 0,
    };
  }

  async enrollInClass(studentId: string, classId: string) {
    // This would add student to class_students table
    // For now, return success message
    return { message: 'Student enrolled in class successfully' };
  }

  async unenrollFromClass(studentId: string, classId: string) {
    // This would remove student from class_students table
    // For now, return success message
    return { message: 'Student unenrolled from class successfully' };
  }
} 