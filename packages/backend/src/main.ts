import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	
	// Enable CORS for the frontend
	app.enableCors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true
	})
	
	// Set global prefix for all routes
	app.setGlobalPrefix('api')
	
	console.log('Starting server on port 3001')
	await app.listen(3001)
	console.log('Server is running on port 3001')
}

bootstrap() 