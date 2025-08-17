import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson, LessonDifficulty, LessonStatus } from '../entities/lesson.entity'

interface CreateLessonDto {
  classId: string;
  title: string;
  description?: string;
  difficulty?: LessonDifficulty;
  duration?: number;
  objectives?: string[];
  materials?: string[];
  teacherId: string;
}

interface UpdateLessonDto {
  title?: string;
  description?: string;
  difficulty?: LessonDifficulty;
  duration?: number;
  status?: LessonStatus;
  objectives?: string[];
  materials?: string[];
}

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const lessons = await this.lessonRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['class', 'teacher'],
    })
    
    const total = await this.lessonRepository.count()
    
    return {
      data: lessons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  }

  async create(createLessonDto: CreateLessonDto) {
    // Ensure objectives and materials are properly formatted as arrays
    const objectives = Array.isArray(createLessonDto.objectives) 
      ? createLessonDto.objectives.filter(obj => obj && obj.trim().length > 0)
      : []
    
    const materials = Array.isArray(createLessonDto.materials)
      ? createLessonDto.materials.filter(mat => mat && mat.trim().length > 0)
      : []

    const lesson = this.lessonRepository.create({
      title: createLessonDto.title,
      classId: createLessonDto.classId,
      teacherId: createLessonDto.teacherId,
      description: createLessonDto.description || '',
      difficulty: createLessonDto.difficulty || LessonDifficulty.BEGINNER,
      duration: createLessonDto.duration || 60,
      status: LessonStatus.DRAFT,
      objectives: objectives,
      materials: materials,
    })
    
    return this.lessonRepository.save(lesson)
  }

  async byId(id: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['class', 'teacher', 'activities'],
    })
    
    if (!lesson) {
      throw new NotFoundException('Lesson not found')
    }
    
    return lesson
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.byId(id)
    Object.assign(lesson, updateLessonDto)
    return this.lessonRepository.save(lesson)
  }

  async remove(id: string) {
    const lesson = await this.byId(id)
    return this.lessonRepository.remove(lesson)
  }

  async getLessonsByClass(classId: string) {
    const lessons = await this.lessonRepository.find({
      where: { classId },
      relations: ['class', 'teacher'],
      order: { createdAt: 'DESC' },
    })
    
    return lessons
  }

  async getLessonsByTeacher(teacherId: string) {
    const lessons = await this.lessonRepository.find({
      where: { teacherId },
      relations: ['class'],
      order: { createdAt: 'DESC' },
    })
    
    return lessons
  }

  async publishLesson(id: string) {
    const lesson = await this.byId(id)
    lesson.status = LessonStatus.PUBLISHED
    return this.lessonRepository.save(lesson)
  }

  async unpublishLesson(id: string) {
    const lesson = await this.byId(id)
    lesson.status = LessonStatus.DRAFT
    return this.lessonRepository.save(lesson)
  }
}