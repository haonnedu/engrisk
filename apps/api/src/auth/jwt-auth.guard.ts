import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('JWT Auth Error:', { err, user, info })
      throw err || new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn')
    }
    
    // Ensure user object has required properties
    if (!user.role) {
      console.error('User object missing role:', user)
      throw new UnauthorizedException('Token không có thông tin role')
    }
    
    return user
  }
} 