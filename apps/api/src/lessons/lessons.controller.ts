import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { LessonItem } from './lessons.type'

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Get()
  list(): LessonItem[] {
    return this.lessons.list()
  }

  @Post()
  create(@Body() body: { classId: string; title: string }) {
    return this.lessons.create(body.classId, body.title)
  }

  @Get(':id')
  byId(@Param('id') id: string): LessonItem {
    return this.lessons.byId(id)
  }
}