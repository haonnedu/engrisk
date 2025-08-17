import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Activity, ActivityType, ActivityDifficulty } from '../entities/activity.entity'
import { QuizQuestion } from '../entities/quiz-question.entity'
import { MatchingPair } from '../entities/matching-pair.entity'
import { FillBlank } from '../entities/fill-blank.entity'
import { CreateActivityDto, UpdateActivityDto } from '../dto/activity.dto'

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(QuizQuestion)
    private quizQuestionRepository: Repository<QuizQuestion>,
    @InjectRepository(MatchingPair)
    private matchingPairRepository: Repository<MatchingPair>,
    @InjectRepository(FillBlank)
    private fillBlankRepository: Repository<FillBlank>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activityRepository.create(createActivityDto)
    const savedActivity = await this.activityRepository.save(activity)

    // Prepare and save related entities safely
    // Quiz Questions
    let normalizedQuestions: QuizQuestion[] = []
    if (createActivityDto.quizQuestions && createActivityDto.quizQuestions.length > 0) {
      normalizedQuestions = createActivityDto.quizQuestions
        .filter(q => (q.question?.trim() || '') !== '')
        .map(q => {
          const options = Array.isArray(q.options)
            ? q.options.map(o => `${o}`.trim()).filter(o => o !== '')
            : []
          const correctIndex = Math.min(Math.max(q.correctAnswer ?? 0, 0), Math.max(options.length - 1, 0))
          return this.quizQuestionRepository.create({
            question: q.question,
            options,
            correctAnswer: correctIndex,
            explanation: q.explanation,
            activityId: savedActivity.id,
          })
        })
        .filter(q => q.options.length > 0)

      if (normalizedQuestions.length > 0) {
        await this.quizQuestionRepository.save(normalizedQuestions)
      }
    }

    // Matching Pairs
    let pairs: MatchingPair[] = []
    if (createActivityDto.matchingPairs && createActivityDto.matchingPairs.length > 0) {
      pairs = createActivityDto.matchingPairs
        .map(p => ({ leftText: p.left?.trim() ?? '', rightText: p.right?.trim() ?? '', shuffle: p.shuffle ?? true }))
        .filter(p => p.leftText !== '' && p.rightText !== '')
        .map(p => this.matchingPairRepository.create({ ...p, activityId: savedActivity.id }))

      if (pairs.length > 0) {
        await this.matchingPairRepository.save(pairs)
      }
    }

    // Fill Blanks
    let blanks: FillBlank[] = []
    if (createActivityDto.fillBlanks && createActivityDto.fillBlanks.length > 0) {
      blanks = createActivityDto.fillBlanks
        .map(b => ({ word: b.word?.trim() ?? '', hint: (b.hint ?? '').trim() || undefined }))
        .filter(b => b.word !== '')
        .map(b => this.fillBlankRepository.create({ ...b, activityId: savedActivity.id }))

      if (blanks.length > 0) {
        await this.fillBlankRepository.save(blanks)
      }
    }

    // Type-specific minimal validations
    switch (createActivityDto.type) {
      case ActivityType.QUIZ:
        if (normalizedQuestions.length === 0) {
          throw new BadRequestException('Quiz activity requires at least one question with options')
        }
        break
      case ActivityType.MATCHING:
        if (pairs.length === 0) {
          throw new BadRequestException('Matching activity requires at least one valid pair')
        }
        break
      case ActivityType.FILL_BLANK:
        if (blanks.length === 0) {
          throw new BadRequestException('Fill-blank activity requires at least one blank')
        }
        break
    }

    return this.findOne(savedActivity.id)
  }

  async findAll(): Promise<Activity[]> {
    return this.activityRepository.find({
      relations: ['lesson'],
      order: { createdAt: 'DESC' },
    })
  }

  async findByLesson(lessonId: string): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { lessonId },
      relations: ['lesson'],
      order: { createdAt: 'ASC' },
    })
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['lesson', 'quizQuestions', 'matchingPairs', 'fillBlanks'],
    })

    if (!activity) {
      throw new NotFoundException('Activity not found')
    }

    return activity
  }

  async update(id: string, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.findOne(id)
    Object.assign(activity, updateActivityDto)
    return this.activityRepository.save(activity)
  }

  async remove(id: string): Promise<void> {
    const activity = await this.findOne(id)
    await this.activityRepository.remove(activity)
  }

  async getActivitiesByType(type: ActivityType): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { type },
      relations: ['lesson'],
      order: { createdAt: 'DESC' },
    })
  }

  async getActivitiesByDifficulty(difficulty: ActivityDifficulty): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { difficulty },
      relations: ['lesson'],
      order: { createdAt: 'DESC' },
    })
  }

  async markAsCompleted(id: string, score: number): Promise<Activity> {
    const activity = await this.findOne(id)
    activity.isCompleted = true
    activity.score = score
    return this.activityRepository.save(activity)
  }
} 