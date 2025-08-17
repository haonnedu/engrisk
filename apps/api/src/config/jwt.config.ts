import { registerAs } from '@nestjs/config'

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024-engrisk-learning-platform',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
})) 