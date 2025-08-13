import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import { appConfig } from './common/config/app.config'
import { validationConfig } from './common/config/validation.config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Debug CORS config
  console.log('CORS Config:', appConfig.cors)
  console.log('CORS_ORIGIN env:', process.env.CORS_ORIGIN)
  
  // CORS
  app.use(cors(appConfig.cors))
  
  // Validation
  app.useGlobalPipes(new ValidationPipe(validationConfig))
  
  // Global prefix
  app.setGlobalPrefix('api')
  
  await app.listen(appConfig.port)
  console.log(`API running on http://localhost:${appConfig.port}`)
}
bootstrap()