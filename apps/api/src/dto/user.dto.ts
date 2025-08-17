import { IsString, IsEnum, IsOptional, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'User phone number' })
  @Matches(/^(\+84|84|0)?[0-9]{9,10}$/, { message: 'Phone number must be valid Vietnamese format' })
  phone!: string

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({ description: 'User role', enum: UserRole, default: UserRole.STUDENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsString()
  @IsOptional()
  avatar?: string
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: 'User phone number', required: false })
  @Matches(/^(\+84|84|0)?[0-9]{9,10}$/, { message: 'Phone number must be valid Vietnamese format' })
  @IsOptional()
  phone?: string

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty({ description: 'User active status', required: false })
  @IsOptional()
  isActive?: boolean
}

export class LoginUserDto {
  @ApiProperty({ description: 'User phone number' })
  @IsString()
  phone!: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  password!: string
} 