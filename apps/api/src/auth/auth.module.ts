import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '../services/user.service'
import { ClassPermissionService } from '../services/class-permission.service'
import { User } from '../entities/user.entity'
import { Class } from '../entities/class.entity'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { 
          expiresIn: configService.get('jwt.expiresIn')
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Class]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ClassPermissionService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}