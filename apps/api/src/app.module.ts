import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ClassesModule } from './classes/classes.module'
import { LessonsModule } from './lessons/lessons.module'

@Module({
  imports: [AuthModule, ClassesModule, LessonsModule],
})
export class AppModule {}