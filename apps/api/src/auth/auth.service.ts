import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
  loginTeacher(email: string, password: string) {
    const ok =
      email === process.env.DEMO_TEACHER_EMAIL &&
      password === process.env.DEMO_TEACHER_PASSWORD
    if (!ok) throw new UnauthorizedException('Invalid credentials')

    // Return a simple demo token (DO NOT use in production)
    return { token: 'demo-teacher-token', role: 'TEACHER', email }
  }
}