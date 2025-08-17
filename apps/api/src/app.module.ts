import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabaseConfig } from './config/database.config'
import { jwtConfig } from './config/jwt.config'

// Entities
import { User } from './entities/user.entity'
import { Class } from './entities/class.entity'
import { Lesson } from './entities/lesson.entity'
import { Activity } from './entities/activity.entity'
import { QuizQuestion } from './entities/quiz-question.entity'
import { MatchingPair } from './entities/matching-pair.entity'
import { FillBlank } from './entities/fill-blank.entity'
import { StudentEnrollment } from './entities/student-enrollment.entity'
import { ActivityResult } from './entities/activity-result.entity'

// Controllers
import { AppController } from './app.controller'
import { UserController } from './controllers/user.controller'
import { ClassesController } from './classes/classes.controller'
import { LessonsController } from './lessons/lessons.controller'
import { ActivitiesController } from './controllers/activities.controller'
import { StudentController } from './controllers/student.controller'
import { TeacherController } from './controllers/teacher.controller'
import { ActivityResultController } from './controllers/activity-result.controller'

// Services
import { AppService } from './app.service'
import { UserService } from './services/user.service'
import { ClassesService } from './classes/classes.service'
import { LessonsService } from './lessons/lessons.service'
import { ActivityService } from './services/activity.service'
import { ClassPermissionService } from './services/class-permission.service'
import { ActivityResultService } from './services/activity-result.service'

// Modules
import { AuthModule } from './auth/auth.module'
import { StudentEnrollmentModule } from './student-enrollment/student-enrollment.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [jwtConfig]
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => getDatabaseConfig(config),
		}),
		TypeOrmModule.forFeature([
			User,
			Class,
			Lesson,
			Activity,
			QuizQuestion,
			MatchingPair,
			FillBlank,
			ActivityResult,
		]),
		AuthModule,
		StudentEnrollmentModule,
	],
	controllers: [
		AppController,
		UserController,
		ClassesController,
		LessonsController,
		ActivitiesController,
		StudentController,
		TeacherController,
		ActivityResultController,
	],
	providers: [
		AppService,
		UserService,
		ClassesService,
		LessonsService,
		ActivityService,
		ClassPermissionService,
		ActivityResultService,
	],
})
export class AppModule {}