import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getDatabaseConfig = (
	configService: ConfigService,
): TypeOrmModuleOptions => {
	const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
	
	return {
		type: 'postgres',
		host: configService.get<string>('DB_HOST', 'aws-1-ap-southeast-1.pooler.supabase.com'),
		port: configService.get<number>('DB_PORT', 6543),
		username: configService.get<string>('DB_USER', 'postgres.gwvctyrmjxdvdqnewkfv'),
		password: configService.get<string>('DB_PASSWORD', '1234'),
		database: configService.get<string>('DB_NAME', 'postgres'),
		entities: [__dirname + '/../**/*.entity{.ts,.js}'],
		synchronize: false, // Tắt synchronize để tránh tạo lại database
		logging: isDevelopment,
		ssl: { rejectUnauthorized: false },
		extra: { max: 10, min: 2 },
	}
} 