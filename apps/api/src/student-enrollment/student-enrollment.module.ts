import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEnrollmentController } from '../controllers/student-enrollment.controller'
import { StudentEnrollmentService } from '../services/student-enrollment.service'
import { StudentEnrollment } from '../entities/student-enrollment.entity'
import { User } from '../entities/user.entity'
import { Class } from '../entities/class.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEnrollment, User, Class])
  ],
  controllers: [StudentEnrollmentController],
  providers: [StudentEnrollmentService],
  exports: [StudentEnrollmentService]
})
export class StudentEnrollmentModule {}
