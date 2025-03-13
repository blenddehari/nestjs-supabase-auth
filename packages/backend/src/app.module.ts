import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProfilesModule } from './profiles/profiles.module'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { StorageModule } from './storage/storage.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		MulterModule.register({
			storage: memoryStorage()
		}),
		AuthModule,
		PrismaModule,
		ProfilesModule,
		StorageModule
	],
	controllers: [],
	providers: []
})
export class AppModule {} 