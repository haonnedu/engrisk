import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson, LessonStatus } from '../entities/lesson.entity'
import { CreateLessonDto, UpdateLessonDto } from '../dto/lesson.dto'

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto, teacherId: string): Promise<Lesson> {
    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      teacherId,
    })

    return this.lessonRepository.save(lesson)
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find({
      relations: ['class', 'teacher'],
      order: { createdAt: 'DESC' },
    })
  }

  async findByClass(classId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { classId },
      relations: ['teacher'],
      order: { createdAt: 'DESC' },
    })
  }

  async findByTeacher(teacherId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { teacherId },
      relations: ['class'],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['class', 'teacher', 'activities'],
    })

    if (!lesson) {
      throw new NotFoundException('Lesson not found')
    }

    return lesson
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id)
    Object.assign(lesson, updateLessonDto)
    return this.lessonRepository.save(lesson)
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.findOne(id)
    await this.lessonRepository.remove(lesson)
  }

  async publish(id: string): Promise<Lesson> {
    const lesson = await this.findOne(id)
    lesson.status = LessonStatus.PUBLISHED
    return this.lessonRepository.save(lesson)
  }

  async archive(id: string): Promise<Lesson> {
    const lesson = await this.findOne(id)
    lesson.status = LessonStatus.ARCHIVED
    return this.lessonRepository.save(lesson)
  }

  async getPublishedLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { status: LessonStatus.PUBLISHED },
      relations: ['class', 'teacher'],
      order: { createdAt: 'DESC' },
    })
  }
} 