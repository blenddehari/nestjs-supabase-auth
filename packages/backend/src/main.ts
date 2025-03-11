import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	
	// Enable CORS
	app.enableCors({
		origin: configService.get('FRONTEND_URL'),
		credentials: true
	})
	
	// Set global prefix
	app.setGlobalPrefix('api')
	
	await app.listen(3000)
	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap() 