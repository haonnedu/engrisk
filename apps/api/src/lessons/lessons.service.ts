import { Injectable, NotFoundException } from '@nestjs/common'

interface LessonItem { id: string; classId: string; title: string; lessonCode: string }

@Injectable()
export class LessonsService {
  private store = new Map<string, LessonItem>()

  list() {
    return Array.from(this.store.values())
  }

  create(classId: string, title: string) {
    const id = Math.random().toString(36).slice(2, 8)
    const lessonCode = this.generateCode()
    const item = { id, classId, title, lessonCode }
    this.store.set(id, item)
    return item
  }

  byId(id: string) {
    const item = this.store.get(id)
    if (!item) throw new NotFoundException('Lesson not found')
    return item
  }

  private generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
    return code
  }
}