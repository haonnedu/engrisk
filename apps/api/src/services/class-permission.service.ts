import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class, ClassStatus } from '../entities/class.entity'

@Injectable()
export class ClassPermissionService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async getClassesByStudent(studentId: string) {
    const classes = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .leftJoinAndSelect('class.lessons', 'lessons')
      .leftJoinAndSelect('class.students', 'students')
      .where('students.id = :studentId', { studentId })
      .andWhere('class.status = :status', { status: ClassStatus.ACTIVE })
      .orderBy('class.createdAt', 'DESC')
      .getMany();
    
    return classes;
  }

  async getClassesByTeacher(teacherId: string) {
    const classes = await this.classRepository.find({
      where: { teacherId },
      relations: ['teacher', 'lessons'],
      order: { createdAt: 'DESC' },
    });
    
    return classes;
  }

  async getClassesByRole(userId: string, role: string) {
    if (role === 'teacher') {
      return this.getClassesByTeacher(userId);
    } else if (role === 'student') {
      return this.getClassesByStudent(userId);
    } else if (role === 'admin') {
      return this.classRepository.find({
        relations: ['teacher', 'lessons'],
        order: { createdAt: 'DESC' },
      });
    }
    return [];
  }
} 