import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('teacher/login')
  loginTeacher(@Body() body: { email: string; password: string }) {
    return this.auth.loginTeacher(body.email, body.password)
  }
}