import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, ClassLevel, ClassStatus } from '../entities/class.entity';
import { CreateClassDto, UpdateClassDto } from '../dto/class.dto';
import { ClassPermissionService } from '../services/class-permission.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private classPermissionService: ClassPermissionService,
    private dataSource: DataSource,
  ) {}

  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const classes = await this.classRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['teacher'],
    });
    
    const total = await this.classRepository.count();
    
    return {
      data: classes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createClassDto: CreateClassDto) {
    const newClass = this.classRepository.create({
      name: createClassDto.name,
      teacherId: createClassDto.teacherId,
      description: createClassDto.description || '',
      level: createClassDto.level || ClassLevel.BEGINNER,
      maxStudents: createClassDto.maxStudents || 20,
      schedule: createClassDto.schedule || '',
      status: ClassStatus.ACTIVE,
    });
    
    return this.classRepository.save(newClass);
  }

  async byId(id: string) {
    const classItem = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher', 'lessons', 'students'],
    });
    
    if (!classItem) {
      throw new NotFoundException('Class not found');
    }
    
    return classItem;
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const classItem = await this.byId(id);
    Object.assign(classItem, updateClassDto);
    return this.classRepository.save(classItem);
  }

  async remove(id: string) {
    const classItem = await this.byId(id);
    return this.classRepository.remove(classItem);
  }

  async getClassStudents(classId: string) {
    const classItem = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['students'],
    });
    
    if (!classItem) {
      throw new NotFoundException('Class not found');
    }
    
    return classItem.students;
  }

  async addStudentToClass(classId: string, studentId: string) {
    console.log(`🔍 Starting addStudentToClass: classId=${classId}, studentId=${studentId}`);
    
    const classItem = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['students'],
    });
    
    if (!classItem) {
      console.log(`❌ Class not found: ${classId}`);
      throw new NotFoundException('Class not found');
    }
    
    console.log(`✅ Class found: ${classItem.name}, current students: ${classItem.students?.length || 0}`);
    
    // Check if student is already in class
    const existingStudent = classItem.students?.find(student => student.id === studentId);
    if (existingStudent) {
      console.log(`❌ Student already in class: ${studentId}`);
      throw new Error('Student is already in this class');
    }
    
    // Check if class is full
    if (classItem.students && classItem.students.length >= classItem.maxStudents) {
      console.log(`❌ Class is full: ${classItem.students.length}/${classItem.maxStudents}`);
      throw new Error('Class is full');
    }
    
    console.log(`✅ Adding student to class_students table...`);
    
    // Add student to class using query builder to handle junction table
    await this.classRepository
      .createQueryBuilder()
      .relation(Class, 'students')
      .of(classId)
      .add(studentId);
    
    console.log(`✅ Student added to class_students table successfully`);
    
    // IMPORTANT: Also create enrollment record in student_enrollments table
    // This ensures data consistency between the two systems
    console.log(`🔍 Creating enrollment record in student_enrollments table...`);
    
    try {
      // First, check if enrollment record already exists
      const existingEnrollment = await this.dataSource.query(`
        SELECT id, status FROM student_enrollments 
        WHERE "studentId" = $1 AND "classId" = $2
        LIMIT 1
      `, [studentId, classId]);
      
      if (existingEnrollment.length > 0) {
        console.log(`⚠️ Enrollment record already exists: ${existingEnrollment[0].id}, status: ${existingEnrollment[0].status}`);
        
        // Update existing enrollment to active
        await this.dataSource.query(`
          UPDATE student_enrollments 
          SET status = $1, "enrolledAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
          WHERE "studentId" = $2 AND "classId" = $3
        `, ['active', studentId, classId]);
        
        console.log(`✅ Updated existing enrollment record to active`);
      } else {
        // Create new enrollment record
        const result = await this.dataSource.query(`
          INSERT INTO student_enrollments (
            "studentId", "classId", status, "enrolledAt", 
            "totalPoints", "completedActivities", "averageScore", 
            "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING id
        `, [studentId, classId, 'active']);
        
        console.log(`✅ Created new enrollment record: ${result[0]?.id}`);
      }
      
      // Verify the enrollment was created/updated
      const verifyEnrollment = await this.dataSource.query(`
        SELECT id, status, "enrolledAt" FROM student_enrollments 
        WHERE "studentId" = $1 AND "classId" = $2
        LIMIT 1
      `, [studentId, classId]);
      
      if (verifyEnrollment.length > 0) {
        console.log(`✅ Enrollment verification successful: ${verifyEnrollment[0].id}, status: ${verifyEnrollment[0].status}`);
      } else {
        console.log(`❌ Enrollment verification failed: No record found`);
      }
      
    } catch (error) {
      console.error(`❌ Error creating/updating enrollment record:`, error);
      console.error(`❌ Error details:`, {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint
      });
      
      // Don't throw error here, just log it
      // The student is already added to the class_students table
    }
    
    console.log(`✅ addStudentToClass completed successfully`);
    return { message: 'Student added to class successfully' };
  }

  async removeStudentFromClass(classId: string, studentId: string) {
    const classItem = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['students'],
    });
    
    if (!classItem) {
      throw new NotFoundException('Class not found');
    }
    
    // Check if student is in class
    const existingStudent = classItem.students?.find(student => student.id === studentId);
    if (!existingStudent) {
      throw new Error('Student is not in this class');
    }
    
    // Remove student from class using query builder to handle junction table
    await this.classRepository
      .createQueryBuilder()
      .relation(Class, 'students')
      .of(classId)
      .remove(studentId);
    
    // IMPORTANT: Also update enrollment record in student_enrollments table
    // This ensures data consistency between the two systems
    try {
      await this.dataSource.query(`
        UPDATE student_enrollments 
        SET status = $1, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "studentId" = $2 AND "classId" = $3
      `, ['inactive', studentId, classId]);
      
      console.log(`✅ Updated enrollment record for student ${studentId} in class ${classId} to inactive`);
    } catch (error) {
      console.error(`❌ Error updating enrollment record:`, error);
      // Don't throw error here, just log it
      // The student is already removed from the class_students table
    }
    
    return { message: 'Student removed from class successfully' };
  }

  async getClassesByTeacher(teacherId: string) {
    return this.classPermissionService.getClassesByTeacher(teacherId);
  }

  async getClassesByStudent(studentId: string) {
    return this.classPermissionService.getClassesByStudent(studentId);
  }

  async getClassesByRole(userId: string, role: string) {
    return this.classPermissionService.getClassesByRole(userId, role);
  }
}