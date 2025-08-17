import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../services/user.service'
import { LoginUserDto } from '../dto/user.dto'
import { User } from '../entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, password: string): Promise<User | null> {
    return this.userService.validateUser({ phone, password })
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.phone, loginUserDto.password)
    
    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated')
    }

    const payload = { 
      sub: user.id, 
      phone: user.phone, 
      role: user.role,
      name: user.name 
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      }
    }
  }

  async register(createUserDto: any) {
    const user = await this.userService.create(createUserDto)
    
    // Remove password from response
    const { password, ...result } = user
    return result
  }
}